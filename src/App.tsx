import { Route, HashRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./Layout";
import Chart from "./pages/Chart";
import Home from "./pages/Home";
import Miner from "./pages/miner";
import Node from "./pages/Node";

function App() {
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
