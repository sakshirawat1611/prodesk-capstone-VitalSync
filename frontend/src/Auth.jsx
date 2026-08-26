import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Auth() {
  //variables to remember things that can change
  const [isLogin, setIsLogin] = useState(true);   // are we showing login or registwr
  const [name, setName] = useState('');            // what they typed in Name box
  const [email, setEmail] = useState('');          // what they typed in Email box
  const [password, setPassword] = useState('');    // what they typed in Password box
  const [message, setMessage] = useState('');       // success/error text to show
  const navigate = useNavigate(); // for redirecting after login


  //what happens when the form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault(); // stop the page from refreshing

    try {
      // pick the right backend address based on mode
      const url = isLogin
        ? 'http://localhost:5000/api/auth/login'
        : 'http://localhost:5000/api/auth/register';

      // pick what data to send (Register also needs name)
      const body = isLogin
        ? { email, password }
        : { name, email, password };

      // actually send the request to the backend
      const response = await axios.post(url, body);

      if (isLogin) {
        // save the token so we stay "logged in"
        localStorage.setItem('token', response.data.token);
        setMessage('Login successful!');
        navigate('/dashboard'); // redirect to dashboard after login
      } else {
        setMessage('Registered successfully! Please log in.');
        setIsLogin(true); // switch to login mode after registering
      }
    } catch (error) {
      // something failed :show the backend's error message
      setMessage(error.response?.data?.message || 'Something went wrong');
    }
  };

  // what in actual shows up on screen
  return (
    <div>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: 'pointer', color: 'blue' }}>
        {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
      </p>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Auth;