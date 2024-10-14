import { useEffect } from "react";
import "./App.css";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Miner from "./pages/Miner";
import Chart from "./pages/Chart";
import Node from "./pages/Node";
import Layout from "./Layout";

function App() {
  useEffect(() => {
    getCurrentWindow().onFocusChanged((focused) => {
      if (!focused) {
        getCurrentWindow().hide();
      }
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/chart" element={<Chart />} />
          <Route path="/miner" element={<Miner />} />
          <Route path="/node" element={<Node />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
