import { Cells, Boards, Candidates, CellsGroup, Board } from "./types";
import { allBoxes, clone, allCols, allRows, ownRow, ownCol } from "./utils";

const candidatesInCells = (cells: Cells) => {
  const candidates = cells
    .map((cell) => [cell.value] as Candidates)
    .reduce((pre, cur) => [...pre, ...cur], []);

  return (["1", "2", "3", "4", "5", "6", "7", "8", "9"] as Candidates).filter(
    (v) => !candidates.includes(v)
  );
};

const fillCandidatesInCellsGroup = (
  board: Board,
  cellsGroup: CellsGroup
): Boards => {
  const boards: Boards = [];

  cellsGroup.forEach((cells) => {
    const candidates = candidatesInCells(cells);
    cells.forEach((cell) => {
      if (cell.value) {
        board.grid[cell.i].candidates = [];
        return;
      }
      const before = board.grid[cell.i].candidates.length;
      board.grid[cell.i].candidates = cell.candidates.filter((v) =>
        candidates.includes(v)
      );
      if (board.grid[cell.i].candidates.length < before) {
        board.grid[cell.i].difficulty *= 2;
      }
    });

    boards.push({
      ...clone(board),
      process: {
        focus: cells.map((cell) => cell.i),
      },
    });
  });

  return boards;
};

const candidatesOnlyForBox = (
  candidatesInBoxCells: Candidates[]
): Candidates[] =>
  candidatesInBoxCells.map((candidates, i, group) => {
    const candidatesInOtherCells = [0, 1, 2]
      .filter((v) => v !== i)
      .map((v) => group[v])
      .reduce((merge, candidates) => [
        ...merge,
        ...candidates.filter((v) => !merge.includes(v)),
      ]);

    return candidates.filter((v) => !candidatesInOtherCells.includes(v));
  });

// |1|2|3|
// |4|5|6|
// |7| | | <- *1
//
// *1 These null cells must be filled 8 or 9
//    Therefore, cells without the null cells in the row including the cells must not be filled 8 and 9.
export const fillCandidatesOnlyForBox = (board: Board): Boards => {
  const boards: Boards = [];

  allBoxes(board).forEach((box) => {
    // Check Rows in Box
    const candidatesInBoxRows = box
      .filter((_, i) => i % 3 === 0)
      .map((_, i) => [box[3 * i], box[3 * i + 1], box[3 * i + 2]])
      .map((row) =>
        row
          .map((cell) => cell.candidates)
          .reduce((merge, candidates) => [
            ...merge,
            ...candidates.filter((v) => !merge.includes(v)),
          ])
      );

    candidatesOnlyForBox(candidatesInBoxRows).forEach(
      (candidatesOnlyForBox, i) => {
        const row = ownRow(board, box[i * 3].i);
        const cellsNotInBox = row.filter(
          (cell) => cell.i < box[i * 3].i || box[i * 3 + 2].i < cell.i
        );
        cellsNotInBox.forEach((cell) => {
          const before = board.grid[cell.i].candidates.length;
          board.grid[cell.i].candidates = board.grid[cell.i].candidates.filter(
            (v) => !candidatesOnlyForBox.includes(v)
          );
          if (board.grid[cell.i].candidates.length < before) {
            board.grid[cell.i].difficulty *= 3;
          }
        });

        boards.push({
          ...clone(board),
          process: {
            focus: row.map((cell) => cell.i),
          },
        });
      }
    );

    // Check Cols in Box
    const candidatesInBoxCols = box
      .filter((_, i) => Math.floor(i / 3) === 0)
      .map((_, i) => [box[i], box[i + 3], box[i + 6]])
      .map((col) =>
        col
          .map((cell) => cell.candidates)
          .reduce((merge, candidates) => [
            ...merge,
            ...candidates.filter((v) => !merge.includes(v)),
          ])
      );

    candidatesOnlyForBox(candidatesInBoxCols).forEach(
      (candidatesOnlyForBox, i) => {
        const col = ownCol(board, box[i].i);
        const cellsNotInBox = col.filter(
          (cell) => cell.i < box[i].i || box[i + 6].i < cell.i
        );
        cellsNotInBox.forEach((cell) => {
          const before = board.grid[cell.i].candidates.length;
          board.grid[cell.i].candidates = board.grid[cell.i].candidates.filter(
            (v) => !candidatesOnlyForBox.includes(v)
          );
          if (board.grid[cell.i].candidates.length < before) {
            board.grid[cell.i].difficulty *= 3;
          }
        });
        boards.push({
          ...clone(board),
          process: {
            focus: col.map((cell) => cell.i),
          },
        });
      }
    );
  });

  return boards;
};

export const fillCandidates = (board: Board): Boards => {
  let boards = fillCandidatesInCellsGroup(board, allRows(board));

  boards = [
    ...boards,
    ...fillCandidatesInCellsGroup(
      clone(boards[boards.length - 1]),
      allCols(boards[boards.length - 1])
    ),
  ];

  boards = [
    ...boards,
    ...fillCandidatesInCellsGroup(
      clone(boards[boards.length - 1]),
      allBoxes(boards[boards.length - 1])
    ),
  ];

  return boards;
};
