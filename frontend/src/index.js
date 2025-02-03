import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import "./index.css";
import App from "./App";
import Board from "./Components/Pages/Board";
import Boards from "./Components/Pages/Boards";
import Changelog from "./Components/Pages/Changelog";
import Home from "./Components/Pages/Home";
import reportWebVitals from "./reportWebVitals";

const routes = createRoutesFromElements(
  <Route>
    <Route path="/" element={<Home />} />
    <Route path="/boards" element={<Boards />} />
    <Route path="/changelog" element={<Changelog />} />
    <Route path="/boards/:boardId" element={<Board />} />
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
