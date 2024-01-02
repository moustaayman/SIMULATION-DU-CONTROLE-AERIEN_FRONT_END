import React from "react";
import video from "../assets/video.mp4";
import image from "../assets/airplane.png";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="home flex container">
      <div className="mainText">
        <h1>Embark on a Virtual Journey Your Flights, Our Simulation</h1>
      </div>
      <div className="homeImages flex">
        <div className="videoDiv">
          <video src={video} autoPlay muted loop className="video"></video>
        </div>
        <img src={image} className="airplane" />
      </div>
      <Link to={"/flights"} className="btn">
        Get Started
      </Link>
    </section>
  );
};
export default Home;
