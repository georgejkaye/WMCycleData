import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import NavBar from "./components/navBar";
import { Outlet, useOutletContext } from "react-router-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Counter, CounterPlus } from "./types/types";

function App() {
  const [counters, setCounters] = useState<CounterPlus[]>([]);

  function getCounters() {
    const requestOptions = {
      method: "GET",
    };

    fetch("/api/counters_plus", requestOptions).then((response) => {
      console.log(response);
      if (response.status == 200) {
        response.json().then((data: CounterPlus[]) => {
          console.log(data);
          data = data.sort((a, b) => b.week_count - a.week_count);
          setCounters(data);
        });
      } else {
        console.log("/api/counters", response.text);
      }
    });
  }

  useEffect(() => {
    getCounters();
  }, []);

  return (
    <div className="App">
      <NavBar></NavBar>
      <Outlet context={counters}></Outlet>
    </div>
  );
}

export function useCounters() {
  return useOutletContext<CounterPlus[]>();
}

export default App;
