import React, { useState } from 'react';
import './Login.css';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


function Login() {
  const { setToken } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const result = await login(email, password);
    setToken(result.token); // Token'ı sakla
    alert("Giriş başarılı!");
    setToken(result.token); // otomatik yönlendirme tetiklenir
    navigate('/dashboard');
  } catch (err) {
    console.error(err);
    alert("Giriş başarısız. Bilgileri kontrol edin.");
  }
};


  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <label>Email</label>
        <input
          type="email"
          placeholder="Emailini Gir"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Şifreni Gir"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="forgot-password">Forgot password?</div>

        <button type="submit" className="login-button">LOGIN</button>

        <p className="or-text">Or Sign Up Using</p>
        <div className="social-buttons">
          <button className="facebook">f</button>
          <button className="twitter">t</button>
          <button className="google">G</button>
        </div>

        <p className="signup">Or Sign Up Using</p>
        <span style={{ color: 'blue', cursor: 'pointer' }}>SIGN UP</span>      </form>
    </div>
  );
}

export default Login;
