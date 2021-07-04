import React from "react";
import { Container, makeStyles } from "@material-ui/core";
import { Board, Cell, Position } from "../sudoku/types";
import { difficult } from "../sudoku/sudoku";
import { CtrlButtons } from "./CtrlButtons";

const useStyles = makeStyles({
  root: {
    textAlign: "left",
  },
});

type SudokuUploaderProps = {
  setInitBoard: (board: Board) => void;
};

export const SudokuUploader = (props: SudokuUploaderProps) => {
  const classes = useStyles();

  const handlerNoUpload = () => {
    props.setInitBoard({
      grid: [...Array(81)].map((_, i): Cell => {
        return {
          i: i as Position,
          value: "",
          candidates: [],
          difficulty: 1,
        };
      }),
      process: null,
    });
  };

  const handlerUpload = React.useCallback(() => {
    props.setInitBoard(difficult);
  }, [props]);

  return (
    <Container className={classes.root}>
      <p>
        dummy dummy dummy dummy dummy dummy dummy dummy dummy dummy dummy dummy
        dummy dummy dummy dummy dummy dummy dummy dummy dummy dummy dummy dummy
        dummy dummy dummy dummy dummy dummy dummy dummy dummy dummy dummy dummy
        dummy dummy dummy dummy dummy dummy dummy dummy dummy dummy dummy dummy
        dummy dummy dummy dummy dummy dummy dummy dummy dummy dummy dummy dummy
        dummy dummy dummy dummy dummy dummy dummy dummy dummy dummy dummy dummy
      </p>
      <CtrlButtons
        leftLabel="NOT UPLOAD"
        rightLabel="UPLOAD"
        handlerOnClickLeft={handlerNoUpload}
        handlerOnClickRight={handlerUpload}
      ></CtrlButtons>
    </Container>
  );
};
