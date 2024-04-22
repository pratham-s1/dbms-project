"use client";
import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";

export default function Loader({ message, style }) {
  const animationContainer = useRef(null);

  useEffect(() => {
    console.log("useEffect");
    lottie.loadAnimation({
      container: animationContainer.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "/running-train.json",
    });

    () => {
      lottie.destroy();
    };
  }, []);

  const quotes = [
    "Finding the best trains for you in seconds",
    "We are working hard to find you the best trains",
    "We are almost at the station",
    "Just a few more tracks to go",
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        ...style,
      }}
    >
      <div
        style={{
          maxWidth: 200,
        }}
        ref={animationContainer}
      ></div>
      <p
        style={{
          color: "#fff",
        }}
      >
        {message ? message : quotes[Math.floor(Math.random() * quotes.length)]}
      </p>
    </div>
  );
}
