import React, { useEffect, useState } from "react";
import "./home.css";
import Messages from "../Messages";
import SpotifyHome from "../SpotifyHome";
import axios from "axios";
import Player from "../Player";

const Home = () => {
  const [greeting, setGreeting] = useState(undefined);
  const [username, setUsername] = useState(undefined);

  const refreshToken = window.localStorage.getItem("refresh_token") || null;
  const expiresIn = window.localStorage.getItem("expires_in") || null;

  let date = new Date();
  let currentTS = date.getTime();
  let accessTokenCreatedTime = window.localStorage.getItem(
    "accessTokenCreatedTime"
  );

  const getAccessToken = (refreshToken) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/refresh`, { refreshToken })
      .then((res) => {
        console.log("Token refreshed and set.");
        window.localStorage.setItem("access_token", res.data.accessToken);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  if (Number(currentTS - accessTokenCreatedTime) > 3600 * 1000 && refreshToken)
    getAccessToken(refreshToken);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;

    const internval = setInterval(() => {
      console.log("Refreshed...");
      getAccessToken(refreshToken);
    }, (expiresIn - 60) * 1000);

    return () => clearInterval(internval);
  }, [refreshToken, expiresIn]);

  useEffect(() => {
    const date = new Date();
    const hr = date.getHours();
    if (hr < 12) {
      setGreeting("Good Morning");
    } else if (hr > 12 && hr < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }

    //Temp store username
    setUsername("Tejas");
  }, []);

  return (
    <section id="home">
      <div className="grid">
        <div className="left">
          <SpotifyHome greeting={greeting} username={username} />
        </div>
        <div className="right">
          <Messages />
        </div>
        <Player />
      </div>
    </section>
  );
};

export default Home;
