import React from "react";
import { solve } from "../sudoku/sudoku";
import { Board, Position, Sudoku, SudokuNumber } from "../sudoku/types";
import { Container, makeStyles } from "@material-ui/core";
import { HorizontalStepper } from "./Stepper";
import { SudokuEditor } from "./SudokuEditor";
import { SudokuAnswer } from "./SudokuAnswer";
import { SudokuUploader } from "./SudokuUploader";
import { clone } from "../sudoku/utils";

const useStyles = makeStyles({
  root: {
    maxWidth: 800,
    marginTop: "10px",
  },
});

export const SudokuBox = () => {
  const classes = useStyles();
  const [sudoku, setSudoku] = React.useState<Sudoku>({
    history: [],
  });
  const [step, setStep] = React.useState(0);

  const handlerEditBoard = React.useCallback(
    (i: number) => (j: Position, v: SudokuNumber) => {
      const editedBoard = {
        ...sudoku.history[i],
        grid: sudoku.history[i].grid.map((cell) =>
          cell.i === j ? { ...cell, value: v } : cell
        ),
      };

      setSudoku({
        history: sudoku.history.map((board, n) =>
          n === i ? editedBoard : board
        ),
      });
    },
    [sudoku.history]
  );

  const solveSudoku = React.useCallback(() => {
    const history = solve(clone(sudoku.history[0]));
    setSudoku({
      history,
    });
  }, [sudoku.history]);

  const onlyFilledBoards = sudoku.history.filter(
    (board, i) =>
      (i === 0 && sudoku.history.length > 1) ||
      (board.process && "id" in board.process)
  );

  const handlerSetInitBoard = (board: Board) => {
    setSudoku({
      history: [board],
    });
    setStep(1);
  };

  return (
    <Container className={classes.root}>
      <HorizontalStepper step={step}></HorizontalStepper>
      {step === 0 && (
        <SudokuUploader setInitBoard={handlerSetInitBoard}></SudokuUploader>
      )}
      {step === 1 && (
        <SudokuEditor
          grid={sudoku.history[0].grid}
          editBoard={handlerEditBoard(0)}
          onClickBackButton={() => {
            setStep(0);
          }}
          onClickSolveButton={() => {
            solveSudoku();
            setStep(2);
          }}
        ></SudokuEditor>
      )}
      {step === 2 && (
        <SudokuAnswer
          history={onlyFilledBoards}
          onClickBackButton={() => {
            setStep(1);
          }}
        ></SudokuAnswer>
      )}
    </Container>
  );
};
