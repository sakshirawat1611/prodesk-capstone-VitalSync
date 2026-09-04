import { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'http://localhost:5000/api/appointments',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAppointments(response.data);
      } catch (error) {
        console.error('Failed to fetch appointments', error);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'http://localhost:5000/api/profile',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserRole(response.data.role);
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleDelete = async (id) => {
    // OPTIMISTIC UPDATE: remove it from the screen immediately,
    // before we even know if the backend call succeeds
    setAppointments((prev) => prev.filter((appt) => appt._id !== id));

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Failed to delete appointment', error);
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>

      <h3>Your Appointments</h3>
      {appointments.map((appt) => (
        <div key={appt._id} style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
          <p>Date: {appt.date}</p>
          <p>Time: {appt.time}</p>
          <p>Status: {appt.status}</p>
          {userRole === 'doctor' && (
            <button onClick={() => handleDelete(appt._id)}>Delete</button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Dashboard;