import React, { useState } from 'react';
import AdminDashboard from './components/AdminDashboard.jsx';
import './components/AdminDashboard.css';

const App = () => {
  const [responseCount, setResponseCount] = useState(() => {
    const v = localStorage.getItem('admin.responseCount');
    const n = v ? parseInt(v, 10) : NaN;
    return !isNaN(n) && n >= 0 ? n : 145;
  });

  return (
    <div className="admin-root">
      <AdminDashboard responseCount={responseCount} onUpdateResponseCount={setResponseCount} />
    </div>
  );
};

export default App;