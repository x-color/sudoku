import React from "react";
import "./App.css";
import { SudokuBox } from "./Sudoku";
import { Header } from "./Header";

function App() {
  return (
    <div className="App">
      <Header></Header>
      <SudokuBox></SudokuBox>
    </div>
  );
}

export default App;
