import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Flights from "./Components/Flights/Flights.jsx";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "./Components/Flights/Styles.css";
import LandingPage from "./Components/Landing Page/LandingPage.jsx";
import "./main.css";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage></LandingPage>}></Route>
        <Route path="/flights" element={<Flights></Flights>}></Route>
        {/* <Route path="/map" element={<Map></Map>}></Route> */}
      </Routes>
    </BrowserRouter>
  );
};
export default App;
