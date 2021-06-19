import React from "react";
import { Board, FillCellProcess, SudokuNumber } from "./sudoku/types";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  row: {
    height: 50,
  },
  board: {
    border: "2px solid #333",
    borderCollapse: "collapse",
    borderSpacing: "0",
  },
  cell: {
    width: "50px",
    border: "1px solid #333",
    padding: "0",
    margin: "0",
  },
  cellInBottomOfBox: {
    borderBottom: "2px solid #333",
  },
  cellInRightOfBox: {
    borderRight: "2px solid #333",
  },
  focusedCell: {
    backgroundColor: "lightblue",
  },
});

type CellProps = {
  value: string;
  bottomOfBox: boolean;
  rightOfBox: boolean;
  focus: boolean;
};

const Cell = (props: CellProps) => {
  const classes = useStyles();
  return (
    <td
      className={`${classes.cell} ${props.focus ? classes.focusedCell : ""} ${
        props.bottomOfBox ? classes.cellInBottomOfBox : ""
      } ${props.rightOfBox ? classes.cellInRightOfBox : ""}`}
    >
      {props.value}
    </td>
  );
};

export const SudokuBoard = (props: Board) => {
  const classes = useStyles();
  const rows = (cells: SudokuNumber[]) => {
    return cells
      .map((_, i, cells) => {
        if (i % 9 > 0) {
          return [];
        }
        return cells.slice(i, i + 9);
      })
      .filter((v) => v.length > 0)
      .map((v, y) => {
        return (
          <tr className={classes.row} key={"tr" + y}>
            {v.map((v, x) => (
              <Cell
                value={v}
                rightOfBox={x % 3 === 2}
                bottomOfBox={y % 3 === 2}
                focus={y * 9 + x === (props.process as FillCellProcess).i}
                key={"cell" + y * 9 + x}
              />
            ))}
          </tr>
        );
      });
  };

  return (
    <div>
      <table className={classes.board}>
        <tbody>{rows(props.grid.map((cell) => cell.value))}</tbody>
      </table>
    </div>
  );
};
