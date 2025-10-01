import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import "./index.css";
import Board from "./Components/Pages/Board.tsx";
import Boards from "./Components/Pages/Boards.tsx";
import Changelog from "./Components/Pages/Changelog.tsx";
import Home from "./Components/Pages/Home.tsx";
import UserPage from "./Components/Pages/UserPage.tsx";
import reportWebVitals from "./reportWebVitals";
import AuthCallback from "./Components/Pages/AuthCallback.tsx";
import MonthlyStats from "./Components/Pages/MonthlyStats.tsx";

const routes = createRoutesFromElements(
  <Route>
    <Route path="/" element={<Home />} />
    <Route path="/boards" element={<Boards />} />
    <Route path="/changelog" element={<Changelog />} />
    <Route path="/account" element={<UserPage />} />
    <Route path="/boards/:boardId" element={<Board />} />
    <Route path="/auth/callback" element={<AuthCallback />} />
    <Route path="/stats" element={<MonthlyStats />} />
  </Route>,
);

const router = createBrowserRouter(routes);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
