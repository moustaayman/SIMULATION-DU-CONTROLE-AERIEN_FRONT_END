import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Flights from "./Components/Flights/Flights.jsx";
import "primereact/resources/themes/lara-light-indigo/theme.css"; // theme
import "primeflex/primeflex.css"; // css utility
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "./Components/Flights/Styles.css";
import LandingPage from "./Components/Landing Page/LandingPage.jsx";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<LandingPage></LandingPage>}></Route>
        <Route path="/flights" element={<Flights></Flights>}></Route>
      </Routes>
    </BrowserRouter>
  );
};
export default App;
