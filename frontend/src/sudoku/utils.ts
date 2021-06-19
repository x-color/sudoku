import { Board, CellsGroup, Position, Edge } from "./types";

export const clone = (board: Board): Board => {
  const grid = board.grid.map((v) => {
    return {
      i: v.i,
      value: v.value,
      candidates: [...v.candidates],
    };
  });

  return {
    grid,
    process: null,
  };
};

export const allRows = (board: Board): CellsGroup => {
  const rows: CellsGroup = [...Array(Edge)].map(() => []);
  board.grid.forEach((cell) => {
    rows[getY(cell.i)].push(cell);
  });
  return rows;
};

export const allCols = (board: Board): CellsGroup => {
  const cols: CellsGroup = [...Array(Edge)].map(() => []);
  board.grid.forEach((cell) => {
    cols[getX(cell.i)].push(cell);
  });
  return cols;
};

export const allBoxes = (board: Board): CellsGroup => {
  const boxes: CellsGroup = [...Array(Edge)].map(() => []);
  board.grid.forEach((cell) => {
    boxes[getBoxId(cell.i)].push(cell);
  });
  return boxes;
};

export const ownRow = (board: Board, i: Position) => {
  const rows = allRows(board);
  return rows[getY(i)];
};

export const ownCol = (board: Board, i: Position) => {
  const cols = allCols(board);
  return cols[getX(i)];
};

export const ownBox = (board: Board, i: Position) => {
  const boxes = allBoxes(board);
  return boxes[getBoxId(i)];
};

export const getX = (i: Position) => i % Edge;
export const getY = (i: Position) => Math.floor(i / Edge);

// BoxId is a position of box
// ----------
// 0 | 1 | 2
// 3 | 4 | 5
// 6 | 7 | 8
// ----------
// e.g.)
// i = 0,1,2,9,10,11,18,19,20 => idx = 0
// i = 30,31,32,39,40,41,48,49,50 => idx = 4
export const getBoxId = (i: Position) =>
  Math.floor(getX(i) / 3) + Math.floor(getY(i) / 3) * 3;
