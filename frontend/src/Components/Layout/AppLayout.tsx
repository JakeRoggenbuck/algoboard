import React from "react";
import { Outlet } from "react-router-dom";
import { UserProvider } from "../Context/UserContext.tsx";

export default function AppLayout() {
  return (
    <UserProvider>
      <Outlet />
    </UserProvider>
  );
}
