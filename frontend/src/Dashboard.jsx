function Dashboard() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <p>You are logged in. This is a protected page.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;