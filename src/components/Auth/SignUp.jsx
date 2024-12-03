import React from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';
import Navbar from '../Navbar/Navbar';

const SignUp = () => {
  return (
    <div>
    <Navbar/>
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <form className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" placeholder="Enter your full name" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Create a password" />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" placeholder="Confirm your password" />
          </div>
          <button type="submit" className="auth-button">Sign Up</button>
        </form>
        <p className="auth-redirect">
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </div>
    </div>
    </div>
  );
};

export default SignUp;