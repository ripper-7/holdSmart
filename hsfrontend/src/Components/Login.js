import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import "./Form.css";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle login form submission
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        const token = await response.text();
        localStorage.setItem("token", token);
        navigate("/portfolio");
      } else {
        console.error("Login failed");
        toast.error("Invalid email or password. Please try again.");
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
        <h2 className="heading">Welcome back!</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="inputGroup">
            <label>Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="input"
            />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>
          <div className="inputGroup">
            <label>Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
              className="input"
            />
            {errors.password && (
              <p className="error">{errors.password.message}</p>
            )}
          </div>
          <button type="submit" className="button" disabled={isLoading}>
            {isLoading ? (
              <div className="d-flex justify-content-center">
                <ClipLoader color="#fff" size={20} />
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <p className="signupText">
          New to holdSmart?{" "}
          <a href="/signup" className="link">
            Create account
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
