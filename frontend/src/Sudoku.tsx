import React from "react";
import { run, sample3 } from "./sudoku/sudoku";
import { FillCellProcess, Sudoku } from "./sudoku/types";

export const SudokuBox = () => {
  const [sudoku, setSudoku] = React.useState<Sudoku>({
    history: [sample3],
  });
  return (
    <div className="App">
      <button
        onClick={() => {
          const history = run(sudoku.history[sudoku.history.length - 1]);
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
            <Table
              cells={board.grid.map((v) => v.value)}
              process={board.process as FillCellProcess}
            ></Table>
          </div>
        ))}
    </div>
  );
};

// const Table = (props: { cells: string[] }) => {
const Table = (props: { cells: string[]; process: FillCellProcess }) => {
  const rows = (cells: string[]) => {
    return cells
      .map((_, i, l) => {
        if (i % 9 > 0) {
          return [];
        }
        return l.slice(i, i + 9);
      })
      .filter((v) => v.length > 0)
      .map((v, i) => {
        return (
          <tr style={{ height: "50px" }} key={"tr" + i}>
            {v.map((v, j) => (
              <td
                style={{
                  width: "50px",
                  border: "1px solid #333",
                  backgroundColor:
                    i * 9 + j === props.process.i ? "lightblue" : "white",
                }}
                key={"td" + v + i + j}
              >
                {v}
              </td>
            ))}
          </tr>
        );
      });
  };

  return (
    <div>
      <table style={{ border: "1px solid #333" }}>
        <tbody>{rows([...props.cells])}</tbody>
      </table>
    </div>
  );
};
