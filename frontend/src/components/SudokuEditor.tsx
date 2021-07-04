import React from "react";
import { Button, Container, Grid, makeStyles } from "@material-ui/core";
import { Cells, Position, SudokuNumber } from "../sudoku/types";
import { SudokuBoard } from "./SudokuBoard";
import { CtrlButtons } from "./CtrlButtons";

const useStyles = makeStyles({
  root: {
    textAlign: "left",
    maxWidth: 600,
  },
  ctrlButtons: {
    marginTop: "10px",
    textAlign: "center",
  },
});

type EditSudokuProps = {
  grid: Cells;
  editBoard: (i: Position, v: SudokuNumber) => void;
  onClickBackButton: () => void;
  onClickSolveButton: () => void;
};

export const SudokuEditor = (props: EditSudokuProps) => {
  const classes = useStyles();
  const handlerEdit = React.useCallback(
    (i: Position) => (v: SudokuNumber) => props.editBoard(i, v),
    [props]
  );

  return (
    <Container className={classes.root}>
      <div>
        <SudokuBoard
          grid={props.grid.map((cell) => cell.value)}
          edit
          editBoard={handlerEdit}
        />
      </div>
      <div className={classes.ctrlButtons}>
        <CtrlButtons
          leftLabel="BACK"
          rightLabel="SOLVE"
          handlerOnClickLeft={props.onClickBackButton}
          handlerOnClickRight={props.onClickSolveButton}
        ></CtrlButtons>
      </div>
    </Container>
  );
};
