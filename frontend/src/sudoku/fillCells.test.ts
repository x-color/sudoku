import { fillOneCell } from "./fillCells";
import { generateFilledSudokuBoard, newCell } from "./testutils";

test("Candidate of the cell's values is only one", () => {
  const board = generateFilledSudokuBoard([newCell(0, "", ["1"])]);

  const filled = fillOneCell(board);
  expect(filled.grid[0].value).toEqual("1");
});

test("A value can be in only the cell, not other cells ​in own row", () => {
  const board = generateFilledSudokuBoard([
    newCell(0, "", ["1", "3"]),
    newCell(1, "", ["1"]),
    newCell(2, "", ["1"]),
    newCell(3, "", ["1"]),
    newCell(4, "", ["1"]),
    newCell(5, "", ["1"]),
    newCell(6, "", ["1"]),
    newCell(7, "", ["1"]),
    newCell(8, "", ["1"]),
  ]);

  const filled = fillOneCell(board);
  expect(filled.grid[0].value).toEqual("3");
});

test("A value can be in only the cell, not other cells ​in own col", () => {
  const board = generateFilledSudokuBoard([
    newCell(0, "", ["1", "3"]),
    newCell(9, "", ["1"]),
    newCell(18, "", ["1"]),
    newCell(27, "", ["1"]),
    newCell(36, "", ["1"]),
    newCell(45, "", ["1"]),
    newCell(54, "", ["1"]),
    newCell(63, "", ["1"]),
    newCell(72, "", ["1"]),
  ]);

  const filled = fillOneCell(board);
  expect(filled.grid[0].value).toEqual("3");
});

test("A value can be in only the cell, not other cells ​in own box", () => {
  const board = generateFilledSudokuBoard([
    newCell(0, "", ["1", "3"]),
    newCell(1, "", ["1"]),
    newCell(2, "", ["1"]),
    newCell(9, "", ["1"]),
    newCell(10, "", ["1"]),
    newCell(11, "", ["1"]),
    newCell(18, "", ["1"]),
    newCell(19, "", ["1"]),
    newCell(20, "", ["1"]),
  ]);

  const filled = fillOneCell(board);
  expect(filled.grid[0].value).toEqual("3");
});
