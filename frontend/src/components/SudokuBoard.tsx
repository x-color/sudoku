import React from "react";
import { SudokuNumber, Position } from "../sudoku/types";
import { makeStyles } from "@material-ui/core/styles";
import { InputBase } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
  },
  board: {
    border: "3px solid #333",
    borderCollapse: "collapse",
    borderSpacing: 0,
    textAlign: "center",
    width: "100%",
  },
  cell: {
    border: "1px solid #333",
    width: "11%",
    position: "relative",
    "&::before": {
      content: "''",
      display: "block",
      paddingTop: "100%",
    },
  },
  cellValueWrapper: {
    position: "absolute",
    top: "50%",
    left: 0,
    width: "100%",
    transform: "translateY(-50%)",
  },
  cellValue: {
    textAlign: "center",
  },
  cellInBottomOfBox: {
    borderBottom: "3px solid #333",
  },
  cellInRightOfBox: {
    borderRight: "3px solid #333",
  },
  primaryColor: {
    backgroundColor: theme.palette.primary.main,
  },
  secondaryColor: {
    backgroundColor: theme.palette.secondary.main,
  },
  bold: {
    fontWeight: "bold",
  },
}));

type CellProps = {
  value: string;
  bottomOfBox: boolean;
  rightOfBox: boolean;
  focus: boolean;
  color?: "primary" | "secondary";
  bold?: boolean;
  edit?: boolean;
  editCell?: (v: SudokuNumber) => void;
};

const Cell = (props: CellProps) => {
  const classes = useStyles();
  const className = [
    classes.cell,
    props.focus && props.color === "primary" ? classes.primaryColor : "",
    props.focus && props.color === "secondary" ? classes.secondaryColor : "",
    props.bold ? classes.bold : "",
    props.bottomOfBox ? classes.cellInBottomOfBox : "",
    props.rightOfBox ? classes.cellInRightOfBox : "",
  ].join(" ");

  const handlerEdit = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!props.editCell) {
      return;
    }
    if (event.target.value.length >= 1) {
      const regex = new RegExp("^[1-9]{1}$");
      if (regex.test(event.target.value[0])) {
        props.editCell(event.target.value[0] as SudokuNumber);
        return;
      }
    }
    props.editCell("");
  };

  return (
    <td className={className}>
      {props.edit ? (
        <InputBase
          className={classes.cellValueWrapper}
          value={props.value}
          type="text"
          inputProps={{
            "aria-label": "naked",
            className: classes.cellValue,
            inputMode: "numeric",
          }}
          onChange={handlerEdit}
        />
      ) : (
        <div className={`${classes.cellValueWrapper} ${classes.cellValue}`}>
          {props.value}
        </div>
      )}
    </td>
  );
};

export type FocusCell = {
  i: Position;
  color: "primary" | "secondary";
};

export type SudokuBoardProps = {
  grid: SudokuNumber[];
  initGrid?: SudokuNumber[];
  focus?: FocusCell[];
  edit?: boolean;
  editBoard?: (i: Position) => (v: SudokuNumber) => void;
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

  const bold = (i: Position) =>
    props.initGrid ? props.initGrid[i] !== "" : false;

  const rows = (cells: SudokuNumber[]) => {
    return cells
      .map((_, i, cells) => (i % 9 > 0 ? [] : cells.slice(i, i + 9)))
      .filter((v) => v.length > 0)
      .map((v, y) => (
        <tr key={"tr" + y}>
          {v.map((v, x) => {
            const p = (y * 9 + x) as Position;
            return (
              <Cell
                edit={props.edit}
                editCell={props.editBoard ? props.editBoard(p) : undefined}
                value={v}
                rightOfBox={x % 3 === 2}
                bottomOfBox={y % 3 === 2}
                focus={focus(p)}
                color={color(p)}
                bold={bold(p)}
                key={"cell" + p}
              />
            );
          })}
        </tr>
      ));
  };

  return (
    <div className={classes.root}>
      <table className={classes.board}>
        <tbody>{rows(props.grid)}</tbody>
      </table>
    </div>
  );
};
