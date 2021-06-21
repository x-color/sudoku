import { Board, SudokuNumber, Cells, Position, Boards } from "./types";
import { fillCandidates, fillCandidatesOnlyForBox } from "./candidates";
import { fillOneCell } from "./fillCells";
import { clone } from "./utils";

export const run = (board: Board): Boards => {
  let boards = [board];
  [...Array(81)].forEach(() => {
    boards = [...boards, ...fillCandidates(clone(boards[boards.length - 1]))];
    boards = [...boards, fillOneCell(clone(boards[boards.length - 1]))];

    if (boards[boards.length - 1].process === null) {
      boards = [
        ...boards,
        ...fillCandidatesOnlyForBox(clone(boards[boards.length - 1])),
      ];
    }
  });

  return boards;
};

const sampleSudoku = (values: SudokuNumber[]): Board => {
  const grid: Cells = values.map((v, i) => {
    return {
      i: i as Position,
      value: v,
      candidates: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
      difficulty: 1,
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
