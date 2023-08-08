import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
console.log(user)
  const handleSubmit = (e, type) => {
    e.preventDefault();
    setUser({ ...user, [type]: e.target.value });
  };

  const onSubmitBtn = async (e) => {
    e.preventDefault();

    let formErrors = {};

    if (!user.email) {
      formErrors.email = "Username is required";
    }

    if (!user.password) {
      formErrors.password = "Password is required";
    }

    setErrors(formErrors);

    if (!Object.keys(formErrors).length) {
      await axios
        .post("http://localhost:3000/users/login", user)
        .then((res) => {
          console.log(res.data.useId);
          localStorage.setItem("userId", res.data.userId);
          localStorage.setItem("token", res.data.token);
          navigate("/dashboard");
          setErrors({});
          window.location.reload(true);
        })
        .catch((err) => {
            console.log(err.message);
            alert("Email or Password is incorrect!!");
        });
    }
  };

  return (
    <div>
      <form>
        <h3>Login</h3>

        <div className="mt-3">
          <label>Username</label>
          <input
            type="username"
            className="form-control"
            placeholder="Enter username"
            value={user.email}
            onChange={(e) => handleSubmit(e, "email")}
          />
        </div>
        {errors.email && <div className="error">{errors.email}</div>}

        <div className="mt-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            value={user.password}
            onChange={(e) => handleSubmit(e, "password")}
          />
        </div>
        {errors.password && <div className="error">{errors.password}</div>}

        <div className="d-grid mt-4">
          <button
            type="submit"
            className="btn btn-primary"
            onClick={(e) => onSubmitBtn(e)}
          >
            Submit
          </button>
          {errors.credential && <div className="error">{errors.credential}</div>}

        </div>
      </form>
    </div>
  );
};
