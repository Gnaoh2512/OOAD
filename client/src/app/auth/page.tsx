"use client";

import React, { FormEvent, useState } from "react";
import styles from "./page.module.scss";
import callAPI from "../utils/callAPI";
import { User } from "../types";

type Mode = "login" | "register";

function Page() {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isEmailValid = /^\S+@\S+\.\S+$/.test(email.trim());
  const isPasswordValid = password.length >= 1;
  const isNameValid = mode !== "register" || name.trim().length > 0;
  const isConfirmPasswordValid = mode !== "register" || password === confirmPassword;

  const isSubmitDisabled = !email || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid || !isNameValid;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (mode === "login") {
        const res = await callAPI<{ user: User }>(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
          method: "POST",
          body: { email: email.trim(), password },
        });
        console.log(res);

        if (res) {
          window.location.href = "/";
          setPassword("");
          setConfirmPassword("");
          return;
        } else {
          alert("Failed to login");
        }
      } else if (mode === "register") {
        if (!isConfirmPasswordValid) {
          alert("Passwords do not match.");
          return;
        }

        const res = await callAPI<{ user: User }>(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
          method: "POST",
          body: {
            name: name.trim(),
            email: email.trim(),
            password,
          },
        });

        if (res.user) {
          window.location.href = "/";
          setPassword("");
          setConfirmPassword("");
          return;
        } else {
          alert("Failed to register");
        }
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h2>{mode === "login" ? "Login" : "Register"}</h2>

        {mode === "register" && (
          <>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            {!isNameValid && <p className={styles.warningText}>Please enter your name.</p>}
          </>
        )}

        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        {email && !isEmailValid && <p className={styles.warningText}>Please enter a valid email address.</p>}

        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {password && !isPasswordValid && <p className={styles.warningText}>Password must be at least 1 character.</p>}

        {mode === "register" && (
          <>
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            {confirmPassword && !isConfirmPasswordValid && <p className={styles.warningText}>Passwords do not match.</p>}
          </>
        )}

        <button type="submit" disabled={isSubmitDisabled}>
          {mode === "login" ? "Login" : "Register"}
        </button>

        <div className={styles.links}>
          {mode === "login" ? (
            <span onClick={() => setMode("register")} className={styles.linkText}>
              Create Account
            </span>
          ) : (
            <span onClick={() => setMode("login")} className={styles.linkText}>
              Back to Login
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

export default Page;
