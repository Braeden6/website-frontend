"use client";
// import SendButton from "@/app/components/molecules/sendButton";
import { useState } from "react";
import {TextField, Box, Typography} from "@mui/material";

import { login, useAuth } from "@/app/utils/auth";
import Link from "next/link";
import SendButton from "../components/molecules/resumeTemplates/sendButton";

export default function Login() {
  const { isLoggedIn, isLoading, auth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = () => {
    login(email, password, auth)
      .then((userCredential) => {
        window.location.href = "/search";
      })
      .catch((error) => {
        const errorMessage = error.message;
        setErrorMessage(errorMessage);
      });
  };

  const handleEmailInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEmail(event.target.value);
  };

  const handlePasswordInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassword(event.target.value);
  };

  
  if (isLoading) return null;

  if (isLoggedIn) {
    window.location.href = "/";
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <Box sx={{display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:'rgba(200, 200, 200, 0.9)',
      padding: '1rem',
      borderRadius: '1rem',}}
        >
      <TextField
        style={{ width: "30%", minWidth: "250px"  }}
        label="Email"
        onChange={handleEmailInputChange}
        value={email}
      />
      <TextField
        label="Password"
        onChange={handlePasswordInputChange}
        type="password"
        value={password}
        style={{ marginTop: "0.5rem", width: "30%", minWidth: "250px" }}
      />
        <SendButton
          onClick={handleLogin}
          text={"Login"}
          style={{ width: "10vw", minWidth: "100px"  }}
        />
      {errorMessage !== "" && (
        <Typography variant="h6" color="error" style={{ marginTop: "1rem" }}>
          {errorMessage}
        </Typography>
      )}
      <Link href="/register" passHref>
        <Typography
          variant="h6"
          color="secondary"
          style={{ marginTop: "1rem", cursor: "pointer" }}
        >
          {"Don't have an account? Click here."}
        </Typography>
      </Link>
      </Box>
    </div>
  );
}
