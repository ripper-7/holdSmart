import React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import './Form.css'; 

function Signup() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const password = watch('password', '');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle signup form submission
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Signup successful");
        toast.success("Account created successfully! Please log in.");
        navigate("/login");

      } else if (response.status === 409) {
        toast.info("Email is already registered. Please try logging in.");
      } else {
        console.error("Signup failed");
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="formWrapper">
        <h2 className="heading">Create an account!</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="inputGroup">
            <label>Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="input"
            />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>
          <div className="inputGroup">
            <label>Password</label>
            <input
              type="password"
              {...register('password', { 
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters long' }
              })}
              className="input"
            />
            {errors.password && <p className="error">{errors.password.message}</p>}
          </div>
          <div className="inputGroup">
            <label>Confirm Password</label>
            <input
              type="password"
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
              className="input"
            />
            {errors.confirmPassword && <p className="error">{errors.confirmPassword.message}</p>}
          </div>
          <button type="submit" className="button" disabled={isLoading}>
            {isLoading ? (
              <div className="d-flex justify-content-center">
                <ClipLoader color="#fff" size={20} />
              </div>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>
        <p className="signupText">
          Already have an account? <a href="/login" className="link">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
