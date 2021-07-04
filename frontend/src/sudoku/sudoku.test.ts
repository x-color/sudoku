import { equal } from "./testutils";
import { Board, Cells, Position, SudokuNumber } from "./types";
import { solve } from "./sudoku";

test("Solve difficult sudoku", () => {
  const board = generateSudokuBoardFromText(
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
  );
  const expected = generateSudokuBoardFromText(
    `
7 3 9  2 5 6  1 8 4
1 6 2  8 4 9  3 7 5
8 5 4  7 3 1  2 6 9

3 4 7  9 1 2  6 5 8
5 1 8  6 7 4  9 3 2
2 9 6  5 8 3  7 4 1

9 8 5  3 2 7  4 1 6
6 7 1  4 9 8  5 2 3
4 2 3  1 6 5  8 9 7`
  );

  const result = solve(board);
  expect(
    result[result.length - 1].grid.every((cell, i) =>
      equal(cell, expected.grid[i])
    )
  ).toBeTruthy();
});

const generateSudokuBoardFromText = (text: string): Board => {
  const values = text
    .split("\n")
    .filter((v) => v.length)
    .join(" ")
    .split(" ")
    .filter((v) => v.length)
    .map((v) => (v === "." ? "" : v)) as SudokuNumber[];

  const grid: Cells = values.map((v, i) => {
    return {
      i: i as Position,
      value: v,
      candidates: v === "" ? ["1", "2", "3", "4", "5", "6", "7", "8", "9"] : [],
      difficulty: v === "" ? 1 : 0,
    };
  });
  return { grid, process: null };
};
