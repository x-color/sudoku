import React from "react";
import { run, sample3 } from "./sudoku/sudoku";
import { Sudoku } from "./sudoku/types";
import { SudokuBoard, SudokuBoardProps } from "./SudokuBoard";
import CheckIcon from "@material-ui/icons/Check";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import { Button, Container, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  input: {
    display: "none",
  },
  button: {
    margin: "20px 40px",
    marginLeft: "0px",
  },
  buttonWrapper: {
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
  },
  root: {
    textAlign: "left",
    maxWidth: 600,
  },
});

const convertImageToSudoku = () => {
  console.log("upload to backend");
  return {
    history: [sample3],
  };
};

export const SudokuBox = () => {
  const classes = useStyles();
  const [sudoku, setSudoku] = React.useState<Sudoku>({
    history: [],
  });
  return (
    <Container className={classes.root}>
      <h2>使い方</h2>
      <div>
        <ol>
          {/* Upload */}
          <li>
            「<span className={classes.bold}>UPLOAD</span>
            」を押して数独の写真をアップロード。スマートフォンならカメラで写真を撮ることも可能！
          </li>
          <div className={classes.buttonWrapper}>
            <input
              accept="image/*"
              className={classes.input}
              id="contained-button-file"
              type="file"
              onChange={() => {
                setSudoku(convertImageToSudoku());
              }}
            />
            <label htmlFor="contained-button-file">
              <Button
                variant="contained"
                color="primary"
                component="span"
                startIcon={<CameraAltIcon />}
                className={classes.button}
              >
                Upload
              </Button>
            </label>
          </div>
          <div className={classes.root}>
            {sudoku.history.length > 0 ? (
              <SudokuBoard
                grid={sudoku.history[0].grid.map((cell) => cell.value)}
                sm
              />
            ) : undefined}
          </div>

          {/* Solve */}
          <li>
            「<span className={classes.bold}>SOLVE</span>
            」ボタンを押して数独を自動で解かせよう！
          </li>
          <div className={classes.buttonWrapper}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CheckIcon />}
              className={classes.button}
              onClick={() => {
                const history = run(sudoku.history[0]);
                setSudoku({
                  history,
                });
              }}
            >
              Solve
            </Button>
          </div>

          {/* To answer */}

          <li>
            答えだけ見たいのならば「
            <span className={classes.bold}>ANSWER</span>
            」ボタンを押して答えまでジャンプできます。
          </li>
          <div className={classes.buttonWrapper}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CheckIcon />}
              className={classes.button}
              onClick={() => {
                console.log("answer");
              }}
            >
              Answer
            </Button>
          </div>
        </ol>
      </div>

      {sudoku.history
        .filter(
          (board, i) =>
            (i === 0 && sudoku.history.length > 1) ||
            (board.process && "id" in board.process)
        )
        .map((board, i, boards) => {
          const focus: SudokuBoardProps["focus"] = [];
          if (board.process !== null && "id" in board.process) {
            focus.push({
              i: board.process.i,
              color: "primary",
            });
          }

          const nextBoard = i + 1 < boards.length ? boards[i + 1] : null;
          if (nextBoard?.process && "id" in nextBoard?.process) {
            focus.push({
              i: nextBoard.process.i,
              color: "secondary",
            });
          }

          return (
            <div key={i} style={{ textAlign: "center" }}>
              <h1>↓</h1>
              <SudokuBoard
                grid={board.grid.map((cell) => cell.value)}
                focus={focus}
              />
            </div>
          );
        })}
    </Container>
  );
};
