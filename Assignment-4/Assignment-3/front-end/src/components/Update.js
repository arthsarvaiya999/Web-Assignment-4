import React, { useState } from "react";

export const Update = () => {

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e, type) => {
    e.preventDefault();
    setUser({ ...user, [type]: e.target.value });
  };

  const onSubmitBtn = async (e) => {
    e.preventDefault();

    let formErrors = {};

    if (!user.name) {
      formErrors.name = "Name is required";
    }

    if (!user.email) {
      formErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      formErrors.email = "Email address is invalid";
    }

    if (!user.password) {
      formErrors.password = "Password is required";
    }

    if (!user.cpassword) {
      formErrors.cpassword = "Confirm Password is required";
    } else if(user.password !== user.cpassword) {
      formErrors.cpassword = "Password and Confirm Password must be same";
    }

    setErrors(formErrors);

    if (!Object.keys(formErrors).length) {

      //post request
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
          id : localStorage.getItem("userId"),
          email: user.email,
          password: user.password,
          name: user.name,
        }),
      };

      fetch("http://localhost:3000/users/" + localStorage.getItem("userId"), requestOptions).then(
        async (response) => {
          if (response.status === 201) {
            console.log("success");
            alert("Successfully updated");
          } else {
            response = await response.data;
            formErrors.cpassword = response.error;
            setErrors(formErrors);
          }
        }
      );

      setErrors({});

    }

  };

  return (
    <div>
      <form>
        <h3>Update User</h3>

        <div className="mt-3">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            value={user.name}
            onChange={(e) => handleSubmit(e, "name")}
          />
        </div>
        {errors.name && <div className="error">{errors.name}</div>}

        <div className="mt-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
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

        <div className="mt-3">
          <label>Confirm Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter Confirm password"
            value={user.cpassword}
            onChange={(e) => handleSubmit(e, "cpassword")}
          />
        </div>
        {errors.cpassword && <div className="error">{errors.cpassword}</div>}

        <div className="d-grid mt-4">
          <button
            type="submit"
            className="btn btn-primary"
            onClick={(e) => onSubmitBtn(e)}
          >
           Update
          </button>
        </div>
      </form>
    </div>
  );
};
