export type SudokuNumber =
  | ""
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9";
export type Cell = {
  readonly i: Position;
  value: SudokuNumber;
  candidates: Candidates;
};
export type Candidates = SudokuNumber[];

export type Cells = Cell[];
export const FillMethods = {
  FillOne: "FillOne",
  FillOnlyOneInRow: "FillOnlyOneInRow",
  FillOnlyOneInCol: "FillOnlyOneInCol",
  FillOnlyOneInBox: "FillOnlyOneInBox",
} as const;
export type FillMethod = typeof FillMethods[keyof typeof FillMethods];

export const CalCandidateMethods = {
  FillOne: "FillOne",
  FillOnlyOneInRow: "FillOnlyOneInRow",
  FillOnlyOneInCol: "FillOnlyOneInCol",
  FillOnlyOneInBox: "FillOnlyOneInBox",
} as const;
export type CalCandidateMethod =
  typeof CalCandidateMethods[keyof typeof CalCandidateMethods];

export type FillCellProcess = Readonly<{
  id: FillMethod;
  i: Position;
}>;

type FillCandidateProcess = Readonly<{
  focus: Position[];
}>;

const position = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
  60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78,
  79, 80,
] as const;
export type Position = typeof position[number];

export type CellsGroup = Cells[];

export const Edge = 9;

export type Board = {
  grid: Cells;
  process: FillCellProcess | FillCandidateProcess | null;
};

export type Boards = Board[];

export type Sudoku = {
  history: Boards;
};

// Sudoku
//  History

// Board
//  Grid
//   Cell
//    Position
//    SudokuNumber
//  Process
//   Method
//   Position

// Candidate
