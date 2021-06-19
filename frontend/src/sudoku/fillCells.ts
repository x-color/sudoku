import { Board, FillMethods, FillMethod, Cells, Position } from "./types";
import { ownBox, ownCol, ownRow } from "./utils";

// 確定法（１マスのみを見てそこに入る可能性のある数字が一つしかない場合に確定する方式）
const fillOneConfirmedCell = (board: Board) => {
  for (const cell of board.grid) {
    if (cell.value || cell.candidates.length > 1) {
      continue;
    }

    board.process = {
      id: FillMethods.FillOne,
      i: cell.i,
    };
    board.grid[cell.i] = {
      ...cell,
      value: cell.candidates[0],
      candidates: [],
    };
    break;
  }

  return board;
};

// 各セルのグループ（Row,Col,Box）を見て、そのグループ内で特定の数字が一か所にしか入らない場合、確定させる
const fillOnlyOneCellInCellsGroup = (
  board: Board,
  ownCells: (board: Board, i: Position) => Cells,
  method: FillMethod
) => {
  for (const cell of board.grid) {
    if (cell.value) {
      continue;
    }

    const otherCellCandidates = ownCells(board, cell.i)
      .filter((c) => c.i !== cell.i)
      .map((cell) => cell.candidates)
      .reduce((merge, cur) => [
        ...merge,
        ...cur.filter((v) => !merge.includes(v)),
      ]);

    const onlyCandidate = cell.candidates.filter(
      (v) => !otherCellCandidates.includes(v)
    );

    if (onlyCandidate.length !== 1) {
      continue;
    }

    board.process = {
      id: method,
      i: cell.i,
    };

    board.grid[cell.i] = {
      ...cell,
      value: onlyCandidate[0],
      candidates: [],
    };

    break;
  }

  return board;
};

const fillOnlyOneCellInCol = (board: Board) => {
  return fillOnlyOneCellInCellsGroup(
    board,
    ownCol,
    FillMethods.FillOnlyOneInCol
  );
};

const fillOnlyOneCellInRow = (board: Board) => {
  return fillOnlyOneCellInCellsGroup(
    board,
    ownRow,
    FillMethods.FillOnlyOneInRow
  );
};

const fillOnlyOneCellInBox = (board: Board) => {
  return fillOnlyOneCellInCellsGroup(
    board,
    ownBox,
    FillMethods.FillOnlyOneInBox
  );
};

export const fillOneCell = (board: Board) => {
  board = fillOneConfirmedCell(board);
  if (board.process) {
    return board;
  }

  board = fillOnlyOneCellInCol(board);
  if (board.process) {
    return board;
  }

  board = fillOnlyOneCellInRow(board);
  if (board.process) {
    return board;
  }

  board = fillOnlyOneCellInBox(board);
  return board;
};
