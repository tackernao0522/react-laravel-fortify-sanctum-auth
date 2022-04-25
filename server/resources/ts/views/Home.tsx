import { Button } from "@mui/material";
import axios from "axios";
import React from "react";
import { useHistory } from "react-router";
import { useAuth } from "./AuthContext";

export const Home = () => {
  const history = useHistory();
  const auth = useAuth()

  const logout = () => {
    axios.get("/sanctum/csrf-cookie").then(() => {
      auth?.signout()
      .then(() => {
        history.push('/login')
      })
    });
  };

  return (
    <div className="p-4">
      <h1>Home</h1>
      <p>Hello! {auth?.user?.name}</p>
      <Button variant="contained" onClick={logout}>
        ログアウト
      </Button>
      {/* アカウント情報を書く */}
    </div>
  );
};
