import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginRoute } from "../utils/APIRoutes";

const Login = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const [loginAttempts, setLoginAttempts] = useState(3);
  const [isFormDisabled, setIsFormDisabled] = useState(false);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (localStorage.getItem("chat-app-user")) {
      navigate("/");
    }

    const storedLoginAttempts = localStorage.getItem("loginAttempts");
    if (storedLoginAttempts !== null) {
      setLoginAttempts(Number(storedLoginAttempts));
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      const { password, username } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });
      if (data.status === false) {
        toast.error(data.msg, toastOptions);

        setLoginAttempts(loginAttempts - 1);
        localStorage.setItem("loginAttempts", loginAttempts - 1);
      } else {
        data.user = { ...data.user, password };
        localStorage.setItem("chat-app-user", JSON.stringify(data.user));
      }
      navigate("/");
    }
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleValidation = () => {
    const { password, username } = values;

    if (isFormDisabled) {
      toast.error(
        "You are currently locked out. Please wait and try again later.",
        toastOptions
      );
      return false;
    }

    if (password === "") {
      toast.error("Password required!", toastOptions);
      return false;
    } else if (username.length === "") {
      toast.error("Username required", toastOptions);
      return false;
    }
    // Lockout mechanism to ensure only 3 attempts and then a 5 minute cooldown period
    if (loginAttempts === 0) {
      setIsFormDisabled(true);
      toast.error(
        "You have reached the maximum number of login attempts and locked out for 5 minutes.",
        toastOptions
      );
      setTimeout(timeoutHandler, 60000);
      return false;
    }

    return true;
  };

  const timeoutHandler = () => {
    console.log("ece");
    setIsFormDisabled(false); // Unlock after timeout
    localStorage.setItem("loginAttempts", 3);
  };

  return (
    <>
      <FormContainer>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="brand">
            <img src={Logo} alt="Logo" />
            <h1>Let's Trace</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
            min="3"
            disabled={isFormDisabled}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
            disabled={isFormDisabled}
          />
          <button type="submit" disabled={isFormDisabled}>
            Login
          </button>
          <span>
            Don't have an account? <Link to="/register">Register</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
};

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: capitalize;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #3d12b3;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;
export default Login;
