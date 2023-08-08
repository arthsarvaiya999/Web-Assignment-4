import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Dashboard = () => {

  const [user, setUser] = useState({
    token : "",
    userId: "",
    name: "",
    email: "",
  });

  const navigate = useNavigate();

  useEffect(() => {

    user.token = localStorage.getItem("token");
    user.userId = localStorage.getItem("userId");

    if (!user.token) {
      navigate("/sign-in");
    }

    async function fetchData() {
      await axios
      .get("http://localhost:3000/users/" + user.userId)
      .then((response) => {
        if (response.status === 200) {
          user.name = response.data.name;
          setUser({ ...user, ["name"]: response.data.name });
          console.log(user.name);
        }
      })
      .catch((err) => {
          alert(err.message);
      });
    }

    fetchData();
    
  }, []);

  const btnDeleteUser = async (e) => {
    e.preventDefault();

    const url = "http://localhost:3000/users/" +  user.userId;

    console.log(url);

    await axios
        .delete(url)
        .then((response) => {
          if (response.status === 200) {
            localStorage.removeItem("userId");
            navigate("/sign-in");
          } else {
            alert(response.data.error);
          }
        })
        .catch((err) => {
            alert(err.response.message);
        });

  };

  const btnUpDate = (e) => {
    e.preventDefault();
    navigate('/update');
  };

  return (
    <div>
      {user.name}
      <button className="space" onClick={(e) => btnDeleteUser(e)}>Delete</button>
      <button className="space" onClick={(e) => btnUpDate(e)}>Update</button>
    </div>
  );

};
