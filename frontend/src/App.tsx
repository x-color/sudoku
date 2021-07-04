import React from "react";
import "./App.css";
import { SudokuBox } from "./components/Sudoku";
import { Header } from "./components/Header";

const App = () => {
  return (
    <div className="App">
      <Header></Header>
      <SudokuBox></SudokuBox>
    </div>
  );
};

export default App;
