import React from "react";
import "./App.css";
import { SudokuBox } from "./Sudoku";
import { Header } from "./Header";
import { Description } from "./Description";
import { ScrollTop } from "./ScrollTop";

function App() {
  return (
    <div className="App">
      <Header></Header>
      <Description></Description>
      <SudokuBox></SudokuBox>
      <ScrollTop></ScrollTop>
    </div>
  );
}

export default App;
