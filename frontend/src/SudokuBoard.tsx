import React from "react";
import { SudokuNumber, Position } from "./sudoku/types";
import { makeStyles } from "@material-ui/core/styles";

const boardSize = (min: number) => {
  const max =
    window.parent.screen.height < window.parent.screen.width
      ? window.parent.screen.height * 0.9
      : window.parent.screen.width * 0.9;
  return min < max ? min : max;
};

const useStyles = makeStyles({
  board: {
    border: "3px solid #333",
    borderCollapse: "collapse",
    borderSpacing: 0,
    margin: "auto",
    textAlign: "center",
  },
  smBoard: {
    height: boardSize(400),
    width: boardSize(400),
  },
  mdBoard: {
    height: boardSize(600),
    width: boardSize(600),
  },
  cell: {
    border: "1px solid #333",
  },
  cellInBottomOfBox: {
    borderBottom: "3px solid #333",
  },
  cellInRightOfBox: {
    borderRight: "3px solid #333",
  },
  primaryColor: {
    backgroundColor: "#a6d4fa",
  },
  secondaryColor: {
    backgroundColor: "#ffe69b",
  },
});

type CellProps = {
  value: string;
  bottomOfBox: boolean;
  rightOfBox: boolean;
  focus: boolean;
  color?: "primary" | "secondary";
};

const Cell = (props: CellProps) => {
  const classes = useStyles();
  return (
    <td
      className={`${classes.cell} ${
        props.focus && props.color === "primary" ? classes.primaryColor : ""
      }  ${
        props.focus && props.color === "secondary" ? classes.secondaryColor : ""
      } ${props.bottomOfBox ? classes.cellInBottomOfBox : ""} ${
        props.rightOfBox ? classes.cellInRightOfBox : ""
      }`}
    >
      {props.value}
    </td>
  );
};

export type SudokuBoardProps = {
  grid: SudokuNumber[];
  focus?: {
    i: Position;
    color: "primary" | "secondary";
  }[];
  sm?: boolean;
};

export const SudokuBoard = (props: SudokuBoardProps) => {
  const classes = useStyles();

  const color = (i: Position) => {
    if (!props.focus) {
      return undefined;
    }
    const hit = props.focus.filter((v) => v.i === i);
    return hit.length ? hit[0].color : undefined;
  };
  const focus = (i: Position) =>
    props.focus ? props.focus.some((v) => i === v.i) : false;

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
          <tr key={"tr" + y}>
            {v.map((v, x) => {
              const p = (y * 9 + x) as Position;
              return (
                <Cell
                  value={v}
                  rightOfBox={x % 3 === 2}
                  bottomOfBox={y % 3 === 2}
                  focus={focus(p)}
                  color={color(p)}
                  key={"cell" + p}
                />
              );
            })}
          </tr>
        );
      });
  };

  const size = props.sm ? classes.smBoard : classes.mdBoard;

  return (
    <div>
      <table className={`${classes.board} ${size}`}>
        <tbody>{rows(props.grid)}</tbody>
      </table>
    </div>
  );
};
