import { Button } from "@mui/material";
import axios from "axios";
import React from "react";
import { useHistory } from "react-router";

export const Home = () => {
  const history = useHistory();
  const logout = () => {
    axios.get("/sanctum/csrf-cookie").then(() => {
      axios.post("/api/logout", {}).then(() => {
        history.push("/login");
      });
    });
  };

  return (
    <div className="p-4">
      <h1>Home</h1>
      <Button variant="contained" onClick={logout}>
        ログアウト
      </Button>
      {/* アカウント情報を書く */}
    </div>
  );
};
