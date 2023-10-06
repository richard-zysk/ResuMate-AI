import React from "react";
import { Routes, Route } from "react-router-dom";
import SignInSide from "./components/pages/signIn";
import SignUp from "./components/pages/signUp";
import { ProtectedRoute } from "./components/auth/protectedRoute";
import DashBoard from "./components/pages/dashboard";
import Profile from "./components/pages/profile";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={
          // <ProtectedRoute>
           <DashBoard/>
          // </ProtectedRoute>
        } />
      <Route
        path="/profile"
        element={
          // <ProtectedRoute>
            <Profile/>
          // </ProtectedRoute>
        }
      />
      <Route path="/signin" element={<SignInSide/>} />
      <Route path="/signup" element={<SignUp/>} />
    </Routes>
  );
}