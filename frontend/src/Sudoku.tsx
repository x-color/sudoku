import React from "react";
import { run, sample3 } from "./sudoku/sudoku";
import { FillCellProcess, Sudoku } from "./sudoku/types";
import { SudokuBoard } from "./SudokuBoard";

export const SudokuBox = () => {
  const [sudoku, setSudoku] = React.useState<Sudoku>({
    history: [sample3],
  });
  return (
    <div className="App">
      <button
        onClick={() => {
          const history = run(sudoku.history[sudoku.history.length - 1]);
          console.log(history.length);
          setSudoku({
            history,
          });
        }}
      >
        Push
      </button>
      {sudoku.history
        .filter((board) => board.process && "id" in board.process)
        .map((board, i) => (
          <div key={i}>
            <h1 style={{ textAlign: "left" }}>No.{i}</h1>
            <SudokuBoard
              grid={board.grid}
              process={board.process as FillCellProcess}
            />
          </div>
        ))}
    </div>
  );
};
