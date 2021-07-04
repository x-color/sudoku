import {
  Board,
  SudokuNumber,
  Cells,
  Position,
  Boards,
  FillMethods,
} from "./types";
import {
  fillCandidates,
  fillCandidatesByLock,
  fillCandidatesByLock2,
  fillCandidatesOnlyForBox,
} from "./candidates";
import { fillOneCell } from "./fillCells";
import { allBoxes, allCols, allRows, clone } from "./utils";

export const solve = (board: Board): Boards => {
  const boards = solveByLogical(board);
  if (solved(boards[boards.length - 1])) {
    return boards;
  }

  return [...boards, ...solveByContradiction(clone(boards[boards.length - 1]))];
};

const solveByLogical = (board: Board): Boards => {
  let boards = [board];
  const emptyCells = board.grid.filter((cell) => cell.value === "");

  for (let i = 0; i < emptyCells.length; i++) {
    boards = [...boards, ...fillCandidates(clone(boards[boards.length - 1]))];
    boards = [...boards, fillOneCell(clone(boards[boards.length - 1]))];

    if (boards[boards.length - 1].process) {
      continue;
    }
    boards = [
      ...boards,
      ...fillCandidatesOnlyForBox(clone(boards[boards.length - 1])),
    ];
    boards = [...boards, fillOneCell(clone(boards[boards.length - 1]))];

    if (boards[boards.length - 1].process) {
      continue;
    }
    boards = [
      ...boards,
      ...fillCandidatesByLock(clone(boards[boards.length - 1])),
    ];
    boards = [...boards, fillOneCell(clone(boards[boards.length - 1]))];

    if (boards[boards.length - 1].process) {
      continue;
    }
    boards = [
      ...boards,
      ...fillCandidatesByLock2(clone(boards[boards.length - 1])),
    ];
    boards = [...boards, fillOneCell(clone(boards[boards.length - 1]))];

    if (boards[boards.length - 1].process === null) {
      break;
    }
  }

  return boards;
};

const solveByContradiction = (board: Board): Boards => {
  const cell = board.grid
    .filter((cell) => cell.value === "")
    .reduce((best, cell) => (cell.candidates < best.candidates ? cell : best));

  for (let i = 0; i < cell.candidates.length; i++) {
    const tempBoard = clone(board);
    tempBoard.grid[cell.i].value = cell.candidates[i];
    tempBoard.grid[cell.i].candidates = [];
    tempBoard.process = {
      id: FillMethods.FillTemporary,
      i: cell.i,
    };

    const boards = [tempBoard, ...solveByLogical(clone(tempBoard))];
    if (solved(boards[boards.length - 1])) {
      return boards;
    }

    if (!validate(boards[boards.length - 1])) {
      continue;
    }

    const c = solveByContradiction(clone(boards[boards.length - 1]));
    if (c.length === 0) {
      continue;
    }

    return [...boards, ...c];
  }

  console.log("Failed to solve");
  return [board];
};

const solved = (board: Board) => {
  return board.grid.every((cell) => cell.value !== "");
};

const validate = (board: Board) => {
  const rows = allRows(board);
  const sameValueInRows = rows.some((row) =>
    row.some((cell, i) =>
      row.slice(i + 1).find((c) => cell.value !== "" && cell.value === c.value)
    )
  );

  const cols = allCols(board);
  const sameValueInCols = cols.some((col) =>
    col.some((cell, i) =>
      col.slice(i + 1).find((c) => cell.value !== "" && cell.value === c.value)
    )
  );

  const boxes = allBoxes(board);
  const sameValueInBoxes = boxes.some((box) =>
    box.some((cell, i) =>
      box.slice(i + 1).find((c) => cell.value !== "" && cell.value === c.value)
    )
  );

  if (sameValueInRows || sameValueInCols || sameValueInBoxes) {
    return false;
  }

  return !board.grid.some(
    (cell) => cell.value === "" && cell.candidates.length === 0
  );
};

const sampleSudoku = (values: SudokuNumber[]): Board => {
  const grid: Cells = values.map((v, i) => {
    return {
      i: i as Position,
      value: v,
      candidates: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
      difficulty: v === "" ? 1 : 0,
    };
  });
  return { grid, process: null };
};

export const method2test = sampleSudoku(
  `
5 . .  . . .  . . .
. . .  5 . .  . . .
. . .  . . .  5 . .

. 5 .  . . .  . . .
. . .  . . .  . . .
. . .  . . .  . 5 .

. . 5  . . .  . . .
. . .  . . 5  . . .
. . .  . . .  . . 5`
    .split("\n")
    .filter((v) => v.length)
    .join(" ")
    .split(" ")
    .filter((v) => v.length)
    .map((v) => (v === "." ? "" : v)) as SudokuNumber[]
);

export const onlyInBox = sampleSudoku(
  `
. . .  . . .  . . .
. . .  . . .  . 1 .
2 3 4  . . .  . . .

. . .  . . .  . . .
. . .  . 1 .  . . .
. . .  . . .  . . .

. . .  . . .  . . .
. . .  . . 1  . . .
. . .  . . .  . . .`
    .split("\n")
    .filter((v) => v.length)
    .join(" ")
    .split(" ")
    .filter((v) => v.length)
    .map((v) => (v === "." ? "" : v)) as SudokuNumber[]
);

// http://nanpure.arumam.com/index.php?%E3%83%8A%E3%83%B3%E3%83%97%E3%83%AC%E5%88%9D%E7%B4%9A%E8%A7%A3%E7%AD%94
export const sample = sampleSudoku(
  `
. 1 4  6 . 8  2 7 .
7 . 2  4 . 9  1 . 8
6 8 .  2 . 1  . 3 5

9 5 3  . . .  7 4 2
. . .  . . .  . . .
1 2 8  . . .  6 5 3

8 7 .  9 . 2  . 1 6
2 . 1  5 . 3  9 . 7
. 9 6  1 . 7  5 2 .`
    .split("\n")
    .filter((v) => v.length)
    .join(" ")
    .split(" ")
    .filter((v) => v.length)
    .map((v) => (v === "." ? "" : v)) as SudokuNumber[]
);

export const onlyInBoxFor2 = sampleSudoku(
  `
. . .  . . .  . . .
. . .  1 . .  . . .
. . .  . . .  . . .

. . .  . . 2  . . .
. . .  . . .  . 1 .
. . .  . . 4  . . .

. . .  . . .  1 . .
. . .  . . .  . . .
1 . .  . . .  . . .`
    .split("\n")
    .filter((v) => v.length)
    .join(" ")
    .split(" ")
    .filter((v) => v.length)
    .map((v) => (v === "." ? "" : v)) as SudokuNumber[]
);

export const sample2 = sampleSudoku(
  `
. . .  . 2 4  . . .
. 4 .  . . 9  . . .
. . 8  3 . .  . . .

. . 1  . . .  . 2 7
9 . .  . 6 .  . . 1
5 7 .  . . .  4 . .

. . .  . . 5  9 . .
. . .  2 . .  . 5 .
. . .  8 1 .  . . .`
    .split("\n")
    .filter((v) => v.length)
    .join(" ")
    .split(" ")
    .filter((v) => v.length)
    .map((v) => (v === "." ? "" : v)) as SudokuNumber[]
);

export const sample3 = sampleSudoku(
  `
. . 2  . . 3  6 . .
. . .  5 . .  . 9 .
7 . .  . 1 .  . . .

. 4 .  . . 5  . . .
6 . 7  . . .  8 . 1
. . .  6 . .  . 4 .

. . .  . 2 .  . . 7
. 5 .  . . 1  . . .
. . 9  8 . .  4 . .`
    .split("\n")
    .filter((v) => v.length)
    .join(" ")
    .split(" ")
    .filter((v) => v.length)
    .map((v) => (v === "." ? "" : v)) as SudokuNumber[]
);

export const sample4 = sampleSudoku(
  `
. . 2  . . .  6 . .
. . .  . . .  1 . .
7 . .  . . .  3 . .

. 4 8  1 . 5  . 3 6
6 . .  . . .  8 . .
. . .  . . .  . . .

. . .  . 2 .  5 . .
. 5 .  . . .  9 . .
. 7 .  . . .  4 . .`
    .split("\n")
    .filter((v) => v.length)
    .join(" ")
    .split(" ")
    .filter((v) => v.length)
    .map((v) => (v === "." ? "" : v)) as SudokuNumber[]
);

export const difficult = sampleSudoku(
  `
. . 9  . 5 .  . 8 4
. . 2  . 4 9  . 7 5
. . .  . . .  . . .

3 . 7  . . .  . 5 .
. . .  6 . .  . . 2
. . .  . 8 3  . . .

. 8 .  . . 7  4 . .
6 . 1  . 9 .  . . .
. 2 .  1 . 5  . . .`
    .split("\n")
    .filter((v) => v.length)
    .join(" ")
    .split(" ")
    .filter((v) => v.length)
    .map((v) => (v === "." ? "" : v)) as SudokuNumber[]
);

export const difficult2 = sampleSudoku(
  `
. . 9  . 5 .  . 8 4
8 . 2  . 4 9  . 7 5
. . .  . . .  . . .

3 . 7  9 . .  . 5 .
2 5 8  6 7 .  . . .
. 9 .  5 8 3  7 . 2

. 8 .  . . 7  4 . .
6 . 1  4 9 8  5 2 .
. 2 .  1 . 5  . . .`
    .split("\n")
    .filter((v) => v.length)
    .join(" ")
    .split(" ")
    .filter((v) => v.length)
    .map((v) => (v === "." ? "" : v)) as SudokuNumber[]
);

export const difficult3 = sampleSudoku(
  `
. . 9  . 5 .  . 8 4
. . 2  . 4 9  . 7 5
. . .  . . .  . . .

3 . 7  9 . .  . 5 .
2 5 8  6 7 .  . . .
. 9 .  5 8 3  7 . 2

. 8 .  . . 7  4 . .
6 . 1  4 9 8  5 2 .
. 2 .  1 . 5  . . .`
    .split("\n")
    .filter((v) => v.length)
    .join(" ")
    .split(" ")
    .filter((v) => v.length)
    .map((v) => (v === "." ? "" : v)) as SudokuNumber[]
);
