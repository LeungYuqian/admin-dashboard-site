import React, { useState, useMemo } from 'react';

const readJson = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

const AdminDashboard = ({ responseCount, onUpdateResponseCount }) => {
  const defaultNames = useMemo(() => ([
    { label: 'Alice', count: 32 },
    { label: 'Bob', count: 28 },
    { label: 'Charlie', count: 24 },
    { label: 'Daisy', count: 20 },
    { label: 'Evan', count: 18 },
    { label: 'Fiona', count: 23 }
  ]), []);

  const [nameItems, setNameItems] = useState(() => readJson('admin.nameData', defaultNames));
  const [yesCount, setYesCount] = useState(() => {
    const d = readJson('admin.attendData', { yes: 87, no: 12, maybe: 46 });
    return d.yes;
  });
  const [noCount, setNoCount] = useState(() => {
    const d = readJson('admin.attendData', { yes: 87, no: 12, maybe: 46 });
    return d.no;
  });
  const [maybeCount, setMaybeCount] = useState(() => {
    const d = readJson('admin.attendData', { yes: 87, no: 12, maybe: 46 });
    return d.maybe;
  });
  const [respCountInput, setRespCountInput] = useState(responseCount);

  const addNameItem = () => {
    setNameItems([...nameItems, { label: '', count: 0 }]);
  };

  const removeNameItem = (idx) => {
    const next = nameItems.slice();
    next.splice(idx, 1);
    setNameItems(next);
  };

  const updateNameLabel = (idx, val) => {
    const next = nameItems.slice();
    next[idx] = { ...next[idx], label: val };
    setNameItems(next);
  };

  const updateNameCount = (idx, val) => {
    const num = parseInt(val, 10);
    const next = nameItems.slice();
    next[idx] = { ...next[idx], count: isNaN(num) ? 0 : Math.max(0, num) };
    setNameItems(next);
  };

  const saveAll = () => {
    const cleaned = nameItems.filter(i => i.label && i.label.trim() !== '');
    localStorage.setItem('admin.nameData', JSON.stringify(cleaned));
    localStorage.setItem('admin.attendData', JSON.stringify({ yes: Math.max(0, yesCount), no: Math.max(0, noCount), maybe: Math.max(0, maybeCount) }));
    const rc = parseInt(respCountInput, 10);
    if (!isNaN(rc) && rc >= 0) {
      localStorage.setItem('admin.responseCount', String(rc));
      onUpdateResponseCount(rc);
    }
    const payload = {
      responseCount: (!isNaN(rc) && rc >= 0) ? rc : responseCount,
      nameData: cleaned,
      attendData: { yes: Math.max(0, yesCount), no: Math.max(0, noCount), maybe: Math.max(0, maybeCount) }
    };
    try {
      fetch('http://localhost:3000/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch {}
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-section">
        <div className="admin-title">回覆總數</div>
        <div className="admin-row">
          <input type="number" min="0" value={respCountInput} onChange={(e) => setRespCountInput(e.target.value)} className="admin-input" />
        </div>
      </div>

      <div className="admin-section">
        <div className="admin-title">名字分佈</div>
        <div className="admin-list">
          {nameItems.map((item, idx) => (
            <div key={idx} className="admin-row">
              <input className="admin-input" type="text" value={item.label} placeholder="名稱" onChange={(e) => updateNameLabel(idx, e.target.value)} />
              <input className="admin-input num" type="number" min="0" value={item.count} onChange={(e) => updateNameCount(idx, e.target.value)} />
              <button className="admin-btn danger" onClick={() => removeNameItem(idx)}>刪除</button>
            </div>
          ))}
        </div>
        <button className="admin-btn" onClick={addNameItem}>新增一列</button>
      </div>

      <div className="admin-section">
        <div className="admin-title">參加意願計數</div>
        <div className="admin-row">
          <label className="admin-label">Yes</label>
          <input className="admin-input num" type="number" min="0" value={yesCount} onChange={(e) => setYesCount(parseInt(e.target.value || '0', 10))} />
        </div>
        <div className="admin-row">
          <label className="admin-label">No</label>
          <input className="admin-input num" type="number" min="0" value={noCount} onChange={(e) => setNoCount(parseInt(e.target.value || '0', 10))} />
        </div>
        <div className="admin-row">
          <label className="admin-label">Maybe</label>
          <input className="admin-input num" type="number" min="0" value={maybeCount} onChange={(e) => setMaybeCount(parseInt(e.target.value || '0', 10))} />
        </div>
      </div>

      <div className="admin-actions">
        <button className="admin-btn primary" onClick={saveAll}>儲存</button>
      </div>
    </div>
  );
};

export default AdminDashboard;