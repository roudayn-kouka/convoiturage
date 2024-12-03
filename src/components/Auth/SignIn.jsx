import React from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';
import Navbar from '../Navbar/Navbar';

const SignIn = () => {
  return (
    <div>
    <Navbar/>

    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <form className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password" />
          </div>
          <div className="form-extra">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className="forgot-password">Forgot Password?</a>
          </div>
          <button type="submit" className="auth-button">Sign In</button>
        </form>
        <p className="auth-redirect">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
    </div>
  );
};

export default SignIn;