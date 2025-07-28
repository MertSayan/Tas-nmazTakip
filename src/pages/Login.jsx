import React, { useState } from 'react';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Giriş bilgileri:", email, password);
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
        <a href="#">SIGN UP</a>
      </form>
    </div>
  );
}

export default Login;
