import {
  fillCandidates,
  fillCandidatesByLock,
  fillCandidatesByLock2,
  fillCandidatesOnlyForBox,
} from "./candidates";
import { equal, generateFilledSudokuBoard, newCell } from "./testutils";

test("Narrow down candidates by basic process", () => {
  const board = generateFilledSudokuBoard([newCell(0, "1")]);
  const expected = generateFilledSudokuBoard([
    newCell(0, "1", []),
    newCell(1, "", ["2", "3", "4", "5", "6", "7", "8", "9"]),
    newCell(2, "", ["2", "3", "4", "5", "6", "7", "8", "9"]),
    newCell(3, "", ["2", "3", "4", "5", "6", "7", "8", "9"]),
    newCell(4, "", ["2", "3", "4", "5", "6", "7", "8", "9"]),
    newCell(5, "", ["2", "3", "4", "5", "6", "7", "8", "9"]),
    newCell(6, "", ["2", "3", "4", "5", "6", "7", "8", "9"]),
    newCell(7, "", ["2", "3", "4", "5", "6", "7", "8", "9"]),
    newCell(8, "", ["2", "3", "4", "5", "6", "7", "8", "9"]),
    newCell(9, "", ["2", "3", "4", "5", "6", "7", "8", "9"]),
    newCell(10, "", ["2", "3", "4", "5", "6", "7", "8", "9"]),
    newCell(11, "", ["2", "3", "4", "5", "6", "7", "8", "9"]),
    newCell(18, "", ["2", "3", "4", "5", "6", "7", "8", "9"]),
    newCell(19, "", ["2", "3", "4", "5", "6", "7", "8", "9"]),
    newCell(20, "", ["2", "3", "4", "5", "6", "7", "8", "9"]),
    newCell(27, "", ["2", "3", "4", "5", "6", "7", "8", "9"]),
    newCell(36, "", ["2", "3", "4", "5", "6", "7", "8", "9"]),
    newCell(45, "", ["2", "3", "4", "5", "6", "7", "8", "9"]),
    newCell(54, "", ["2", "3", "4", "5", "6", "7", "8", "9"]),
    newCell(63, "", ["2", "3", "4", "5", "6", "7", "8", "9"]),
    newCell(72, "", ["2", "3", "4", "5", "6", "7", "8", "9"]),
  ]);

  const result = fillCandidates(board);
  expect(
    result[result.length - 1].grid.every((cell, i) =>
      equal(cell, expected.grid[i])
    )
  ).toBeTruthy();
});

test("Narrow down candidates in row by only-for-box process", () => {
  const board = generateFilledSudokuBoard([
    newCell(0, "", ["1", "2", "3"]),
    newCell(1, "", ["2", "3"]),
    newCell(2, "", ["1", "2", "3"]),
    newCell(9, "", ["2", "3"]),
    newCell(10, "", ["2", "3"]),
    newCell(11, "", ["2", "3"]),
    newCell(18, "", ["2", "3"]),
    newCell(19, "", ["2", "3"]),
    newCell(20, "", ["2", "3"]),
  ]);
  const expected = generateFilledSudokuBoard([
    newCell(0, "", ["1", "2", "3"]),
    newCell(1, "", ["2", "3"]),
    newCell(2, "", ["1", "2", "3"]),
    newCell(9, "", ["2", "3"]),
    newCell(10, "", ["2", "3"]),
    newCell(11, "", ["2", "3"]),
    newCell(18, "", ["2", "3"]),
    newCell(19, "", ["2", "3"]),
    newCell(20, "", ["2", "3"]),
    newCell(3, "", ["2", "3", "4", "5", "6", "7", "8", "9"]),
    newCell(4, "", ["2", "3", "4", "5", "6", "7", "8", "9"]),
    newCell(5, "", ["2", "3", "4", "5", "6", "7", "8", "9"]),
    newCell(6, "", ["2", "3", "4", "5", "6", "7", "8", "9"]),
    newCell(7, "", ["2", "3", "4", "5", "6", "7", "8", "9"]),
    newCell(8, "", ["2", "3", "4", "5", "6", "7", "8", "9"]),
  ]);

  const result = fillCandidatesOnlyForBox(board);
  expect(
    result[result.length - 1].grid.every((cell, i) =>
      equal(cell, expected.grid[i])
    )
  ).toBeTruthy();
});

test("Narrow down candidates in col by only-for-box process", () => {
  const board = generateFilledSudokuBoard([
    newCell(0, "", ["1", "2", "3"]),
    newCell(1, "", ["2", "3"]),
    newCell(2, "", ["2", "3"]),
    newCell(9, "", ["1", "2", "3"]),
    newCell(10, "", ["2", "3"]),
    newCell(11, "", ["2", "3"]),
    newCell(18, "", ["2", "3"]),
    newCell(19, "", ["2", "3"]),
    newCell(20, "", ["2", "3"]),
  ]);
  const expected = generateFilledSudokuBoard([
    newCell(0, "", ["1", "2", "3"]),
    newCell(1, "", ["2", "3"]),
    newCell(2, "", ["2", "3"]),
    newCell(9, "", ["1", "2", "3"]),
    newCell(10, "", ["2", "3"]),
    newCell(11, "", ["2", "3"]),
    newCell(18, "", ["2", "3"]),
    newCell(19, "", ["2", "3"]),
    newCell(20, "", ["2", "3"]),
    newCell(27, "", ["2", "3", "4", "5", "6", "7", "8", "9"]),
    newCell(36, "", ["2", "3", "4", "5", "6", "7", "8", "9"]),
    newCell(45, "", ["2", "3", "4", "5", "6", "7", "8", "9"]),
    newCell(54, "", ["2", "3", "4", "5", "6", "7", "8", "9"]),
    newCell(63, "", ["2", "3", "4", "5", "6", "7", "8", "9"]),
    newCell(72, "", ["2", "3", "4", "5", "6", "7", "8", "9"]),
  ]);

  const result = fillCandidatesOnlyForBox(board);
  expect(
    result[result.length - 1].grid.every((cell, i) =>
      equal(cell, expected.grid[i])
    )
  ).toBeTruthy();
});

test("Narrow down candidates in row by 2 Lock process", () => {
  const board = generateFilledSudokuBoard([
    newCell(0, "", ["1", "2"]),
    newCell(3, "", ["1", "2"]),
  ]);
  const expected = generateFilledSudokuBoard([
    newCell(0, "", ["1", "2"]),
    newCell(1, "", ["3", "4", "5", "6", "7", "8", "9"]),
    newCell(2, "", ["3", "4", "5", "6", "7", "8", "9"]),
    newCell(3, "", ["1", "2"]),
    newCell(4, "", ["3", "4", "5", "6", "7", "8", "9"]),
    newCell(5, "", ["3", "4", "5", "6", "7", "8", "9"]),
    newCell(6, "", ["3", "4", "5", "6", "7", "8", "9"]),
    newCell(7, "", ["3", "4", "5", "6", "7", "8", "9"]),
    newCell(8, "", ["3", "4", "5", "6", "7", "8", "9"]),
  ]);

  const result = fillCandidatesByLock(board);
  expect(
    result[result.length - 1].grid.every((cell, i) =>
      equal(cell, expected.grid[i])
    )
  ).toBeTruthy();
});

test("Narrow down candidates in row by 3 Lock process", () => {
  const board = generateFilledSudokuBoard([
    newCell(0, "", ["1", "2", "3"]),
    newCell(3, "", ["1", "2", "3"]),
    newCell(6, "", ["1", "2", "3"]),
  ]);
  const expected = generateFilledSudokuBoard([
    newCell(0, "", ["1", "2", "3"]),
    newCell(1, "", ["4", "5", "6", "7", "8", "9"]),
    newCell(2, "", ["4", "5", "6", "7", "8", "9"]),
    newCell(3, "", ["1", "2", "3"]),
    newCell(4, "", ["4", "5", "6", "7", "8", "9"]),
    newCell(5, "", ["4", "5", "6", "7", "8", "9"]),
    newCell(6, "", ["1", "2", "3"]),
    newCell(7, "", ["4", "5", "6", "7", "8", "9"]),
    newCell(8, "", ["4", "5", "6", "7", "8", "9"]),
  ]);

  const result = fillCandidatesByLock(board);
  expect(
    result[result.length - 1].grid.every((cell, i) =>
      equal(cell, expected.grid[i])
    )
  ).toBeTruthy();
});

test("Narrow down candidates in col by 2 Lock process", () => {
  const board = generateFilledSudokuBoard([
    newCell(0, "", ["1", "2"]),
    newCell(27, "", ["1", "2"]),
  ]);
  const expected = generateFilledSudokuBoard([
    newCell(0, "", ["1", "2"]),
    newCell(9, "", ["3", "4", "5", "6", "7", "8", "9"]),
    newCell(18, "", ["3", "4", "5", "6", "7", "8", "9"]),
    newCell(27, "", ["1", "2"]),
    newCell(36, "", ["3", "4", "5", "6", "7", "8", "9"]),
    newCell(45, "", ["3", "4", "5", "6", "7", "8", "9"]),
    newCell(54, "", ["3", "4", "5", "6", "7", "8", "9"]),
    newCell(63, "", ["3", "4", "5", "6", "7", "8", "9"]),
    newCell(72, "", ["3", "4", "5", "6", "7", "8", "9"]),
  ]);

  const result = fillCandidatesByLock(board);
  expect(
    result[result.length - 1].grid.every((cell, i) =>
      equal(cell, expected.grid[i])
    )
  ).toBeTruthy();
});

test("Narrow down candidates in col by 3 Lock process", () => {
  const board = generateFilledSudokuBoard([
    newCell(0, "", ["1", "2", "3"]),
    newCell(27, "", ["1", "2", "3"]),
    newCell(54, "", ["1", "2", "3"]),
  ]);
  const expected = generateFilledSudokuBoard([
    newCell(0, "", ["1", "2", "3"]),
    newCell(9, "", ["4", "5", "6", "7", "8", "9"]),
    newCell(18, "", ["4", "5", "6", "7", "8", "9"]),
    newCell(27, "", ["1", "2", "3"]),
    newCell(36, "", ["4", "5", "6", "7", "8", "9"]),
    newCell(45, "", ["4", "5", "6", "7", "8", "9"]),
    newCell(54, "", ["1", "2", "3"]),
    newCell(63, "", ["4", "5", "6", "7", "8", "9"]),
    newCell(72, "", ["4", "5", "6", "7", "8", "9"]),
  ]);

  const result = fillCandidatesByLock(board);
  expect(
    result[result.length - 1].grid.every((cell, i) =>
      equal(cell, expected.grid[i])
    )
  ).toBeTruthy();
});

test("Narrow down candidates in box by 2 Lock process", () => {
  const board = generateFilledSudokuBoard([
    newCell(0, "", ["1", "2"]),
    newCell(20, "", ["1", "2"]),
  ]);
  const expected = generateFilledSudokuBoard([
    newCell(0, "", ["1", "2"]),
    newCell(1, "", ["3", "4", "5", "6", "7", "8", "9"]),
    newCell(2, "", ["3", "4", "5", "6", "7", "8", "9"]),
    newCell(9, "", ["3", "4", "5", "6", "7", "8", "9"]),
    newCell(10, "", ["3", "4", "5", "6", "7", "8", "9"]),
    newCell(11, "", ["3", "4", "5", "6", "7", "8", "9"]),
    newCell(18, "", ["3", "4", "5", "6", "7", "8", "9"]),
    newCell(19, "", ["3", "4", "5", "6", "7", "8", "9"]),
    newCell(20, "", ["1", "2"]),
  ]);

  const result = fillCandidatesByLock(board);
  expect(
    result[result.length - 1].grid.every((cell, i) =>
      equal(cell, expected.grid[i])
    )
  ).toBeTruthy();
});

test("Narrow down candidates in box by 3 Lock process", () => {
  const board = generateFilledSudokuBoard([
    newCell(0, "", ["1", "2", "3"]),
    newCell(10, "", ["1", "2", "3"]),
    newCell(20, "", ["1", "2", "3"]),
  ]);
  const expected = generateFilledSudokuBoard([
    newCell(0, "", ["1", "2", "3"]),
    newCell(1, "", ["4", "5", "6", "7", "8", "9"]),
    newCell(2, "", ["4", "5", "6", "7", "8", "9"]),
    newCell(9, "", ["4", "5", "6", "7", "8", "9"]),
    newCell(10, "", ["1", "2", "3"]),
    newCell(11, "", ["4", "5", "6", "7", "8", "9"]),
    newCell(18, "", ["4", "5", "6", "7", "8", "9"]),
    newCell(19, "", ["4", "5", "6", "7", "8", "9"]),
    newCell(20, "", ["1", "2", "3"]),
  ]);

  const result = fillCandidatesByLock(board);
  expect(
    result[result.length - 1].grid.every((cell, i) =>
      equal(cell, expected.grid[i])
    )
  ).toBeTruthy();
});

test("Narrow down candidates in row by 2 Lock2 process", () => {
  const board = generateFilledSudokuBoard([
    newCell(0, "", ["1", "2", "3", "8", "9"]),
    newCell(1, "", ["1", "2", "3", "4"]),
    newCell(2, "", ["1", "2", "3", "4"]),
    newCell(3, "", ["1", "2", "3", "8", "9"]),
    newCell(4, "", ["1", "2", "3", "4"]),
    newCell(5, "", ["1", "2", "3", "4"]),
    newCell(6, "", ["1", "2", "3", "4"]),
    newCell(7, "", ["1", "2", "3", "4"]),
    newCell(8, "", ["1", "2", "3", "4"]),
  ]);

  const expected = generateFilledSudokuBoard([
    newCell(0, "", ["8", "9"]),
    newCell(1, "", ["1", "2", "3", "4"]),
    newCell(2, "", ["1", "2", "3", "4"]),
    newCell(3, "", ["8", "9"]),
    newCell(4, "", ["1", "2", "3", "4"]),
    newCell(5, "", ["1", "2", "3", "4"]),
    newCell(6, "", ["1", "2", "3", "4"]),
    newCell(7, "", ["1", "2", "3", "4"]),
    newCell(8, "", ["1", "2", "3", "4"]),
  ]);

  const result = fillCandidatesByLock2(board);
  expect(
    result[result.length - 1].grid.every((cell, i) =>
      equal(cell, expected.grid[i])
    )
  ).toBeTruthy();
});

test("Narrow down candidates in row by 3 Lock2 process", () => {
  const board = generateFilledSudokuBoard([
    newCell(0, "", ["1", "2", "3", "7", "8", "9"]),
    newCell(1, "", ["1", "2", "3", "4"]),
    newCell(2, "", ["1", "2", "3", "4"]),
    newCell(3, "", ["1", "2", "3", "7", "8", "9"]),
    newCell(4, "", ["1", "2", "3", "4"]),
    newCell(5, "", ["1", "2", "3", "4"]),
    newCell(6, "", ["1", "2", "3", "7", "8", "9"]),
    newCell(7, "", ["1", "2", "3", "4"]),
    newCell(8, "", ["1", "2", "3", "4"]),
  ]);

  const expected = generateFilledSudokuBoard([
    newCell(0, "", ["7", "8", "9"]),
    newCell(1, "", ["1", "2", "3", "4"]),
    newCell(2, "", ["1", "2", "3", "4"]),
    newCell(3, "", ["7", "8", "9"]),
    newCell(4, "", ["1", "2", "3", "4"]),
    newCell(5, "", ["1", "2", "3", "4"]),
    newCell(6, "", ["7", "8", "9"]),
    newCell(7, "", ["1", "2", "3", "4"]),
    newCell(8, "", ["1", "2", "3", "4"]),
  ]);

  const result = fillCandidatesByLock2(board);
  expect(
    result[result.length - 1].grid.every((cell, i) =>
      equal(cell, expected.grid[i])
    )
  ).toBeTruthy();
});

test("Narrow down candidates in col by 2 Lock2 process", () => {
  const board = generateFilledSudokuBoard([
    newCell(0, "", ["1", "2", "3", "8", "9"]),
    newCell(9, "", ["1", "2", "3", "4"]),
    newCell(18, "", ["1", "2", "3", "4"]),
    newCell(27, "", ["1", "2", "3", "8", "9"]),
    newCell(36, "", ["1", "2", "3", "4"]),
    newCell(45, "", ["1", "2", "3", "4"]),
    newCell(54, "", ["1", "2", "3", "4"]),
    newCell(63, "", ["1", "2", "3", "4"]),
    newCell(72, "", ["1", "2", "3", "4"]),
  ]);

  const expected = generateFilledSudokuBoard([
    newCell(0, "", ["8", "9"]),
    newCell(9, "", ["1", "2", "3", "4"]),
    newCell(18, "", ["1", "2", "3", "4"]),
    newCell(27, "", ["8", "9"]),
    newCell(36, "", ["1", "2", "3", "4"]),
    newCell(45, "", ["1", "2", "3", "4"]),
    newCell(54, "", ["1", "2", "3", "4"]),
    newCell(63, "", ["1", "2", "3", "4"]),
    newCell(72, "", ["1", "2", "3", "4"]),
  ]);

  const result = fillCandidatesByLock2(board);
  expect(
    result[result.length - 1].grid.every((cell, i) =>
      equal(cell, expected.grid[i])
    )
  ).toBeTruthy();
});

test("Narrow down candidates in col by 3 Lock2 process", () => {
  const board = generateFilledSudokuBoard([
    newCell(0, "", ["1", "2", "3", "7", "8", "9"]),
    newCell(9, "", ["1", "2", "3", "4"]),
    newCell(18, "", ["1", "2", "3", "4"]),
    newCell(27, "", ["1", "2", "3", "7", "8", "9"]),
    newCell(36, "", ["1", "2", "3", "4"]),
    newCell(45, "", ["1", "2", "3", "4"]),
    newCell(54, "", ["1", "2", "3", "7", "8", "9"]),
    newCell(63, "", ["1", "2", "3", "4"]),
    newCell(72, "", ["1", "2", "3", "4"]),
  ]);

  const expected = generateFilledSudokuBoard([
    newCell(0, "", ["7", "8", "9"]),
    newCell(9, "", ["1", "2", "3", "4"]),
    newCell(18, "", ["1", "2", "3", "4"]),
    newCell(27, "", ["7", "8", "9"]),
    newCell(36, "", ["1", "2", "3", "4"]),
    newCell(45, "", ["1", "2", "3", "4"]),
    newCell(54, "", ["7", "8", "9"]),
    newCell(63, "", ["1", "2", "3", "4"]),
    newCell(72, "", ["1", "2", "3", "4"]),
  ]);

  const result = fillCandidatesByLock2(board);
  expect(
    result[result.length - 1].grid.every((cell, i) =>
      equal(cell, expected.grid[i])
    )
  ).toBeTruthy();
});

test("Narrow down candidates in box by 2 Lock2 process", () => {
  const board = generateFilledSudokuBoard([
    newCell(0, "", ["1", "2", "3", "8", "9"]),
    newCell(1, "", ["1", "2", "3", "4"]),
    newCell(2, "", ["1", "2", "3", "4"]),
    newCell(9, "", ["1", "2", "3", "8", "9"]),
    newCell(10, "", ["1", "2", "3", "4"]),
    newCell(11, "", ["1", "2", "3", "4"]),
    newCell(18, "", ["1", "2", "3", "4"]),
    newCell(19, "", ["1", "2", "3", "4"]),
    newCell(20, "", ["1", "2", "3", "4"]),
  ]);

  const expected = generateFilledSudokuBoard([
    newCell(0, "", ["8", "9"]),
    newCell(1, "", ["1", "2", "3", "4"]),
    newCell(2, "", ["1", "2", "3", "4"]),
    newCell(9, "", ["8", "9"]),
    newCell(10, "", ["1", "2", "3", "4"]),
    newCell(11, "", ["1", "2", "3", "4"]),
    newCell(18, "", ["1", "2", "3", "4"]),
    newCell(19, "", ["1", "2", "3", "4"]),
    newCell(20, "", ["1", "2", "3", "4"]),
  ]);

  const result = fillCandidatesByLock2(board);
  expect(
    result[result.length - 1].grid.every((cell, i) =>
      equal(cell, expected.grid[i])
    )
  ).toBeTruthy();
});

test("Narrow down candidates in box by 3 Lock2 process", () => {
  const board = generateFilledSudokuBoard([
    newCell(0, "", ["1", "2", "3", "7", "8", "9"]),
    newCell(1, "", ["1", "2", "3", "4"]),
    newCell(2, "", ["1", "2", "3", "4"]),
    newCell(9, "", ["1", "2", "3", "7", "8", "9"]),
    newCell(10, "", ["1", "2", "3", "4"]),
    newCell(11, "", ["1", "2", "3", "4"]),
    newCell(18, "", ["1", "2", "3", "7", "8", "9"]),
    newCell(19, "", ["1", "2", "3", "4"]),
    newCell(20, "", ["1", "2", "3", "4"]),
  ]);

  const expected = generateFilledSudokuBoard([
    newCell(0, "", ["7", "8", "9"]),
    newCell(1, "", ["1", "2", "3", "4"]),
    newCell(2, "", ["1", "2", "3", "4"]),
    newCell(9, "", ["7", "8", "9"]),
    newCell(10, "", ["1", "2", "3", "4"]),
    newCell(11, "", ["1", "2", "3", "4"]),
    newCell(18, "", ["7", "8", "9"]),
    newCell(19, "", ["1", "2", "3", "4"]),
    newCell(20, "", ["1", "2", "3", "4"]),
  ]);

  const result = fillCandidatesByLock2(board);
  expect(
    result[result.length - 1].grid.every((cell, i) =>
      equal(cell, expected.grid[i])
    )
  ).toBeTruthy();
});
