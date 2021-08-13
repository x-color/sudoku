import {
  Board,
  Candidates,
  Cell,
  Cells,
  Position,
  SudokuNumber,
} from "./types";

export const generateFilledSudokuBoard = (cells: Cells): Board => {
  const grid: Cells = [...Array(81)].map((_, i) => {
    const cell = cells.find((cell) => cell.i === i);
    if (cell) {
      return cell;
    }
    return newCell(i, "");
  });
  return { grid, process: null };
};

export const generateSudokuBoard = (src: string): Board => {
  const values = src
    .split("\n")
    .filter((v) => v.length)
    .join(" ")
    .split(" ")
    .filter((v) => v.length)
    .map((v) => (v === "." ? "" : v)) as Candidates;

  const grid: Cells = values.map((v, i) => {
    return newCell(i, v);
  });
  return { grid, process: null };
};

export const newCell = (
  i: number,
  value: string,
  candidates?: string[]
): Cell => {
  if (value !== "") {
    return {
      i: i as Position,
      value: value as SudokuNumber,
      candidates: [],
      difficulty: 1,
    };
  }
  return {
    i: i as Position,
    value: "",
    candidates: (candidates as Candidates) ?? [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
    ],
    difficulty: 1,
  };
};

export const equal = (a: Cell, b: Cell): boolean => {
  const r =
    a.i === b.i &&
    a.value === b.value &&
    a.candidates.length === b.candidates.length &&
    a.candidates.every((v, i) => v === b.candidates[i]);
  r ? null : console.log(a, b);
  return (
    a.i === b.i &&
    a.value === b.value &&
    a.candidates.length === b.candidates.length &&
    a.candidates.every((v, i) => v === b.candidates[i])
  );
};
