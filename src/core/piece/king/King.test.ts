import Board from "../../board/Board";
import Position from "../../Position";
import {test, assert, expect} from "vitest";
import Knight from "../knight/Knight";

test("king cannot move to dangerous position", () => {
    const board = new Board();

    const whiteKnight = board.getPieceAt(new Position(1, 7))!;
    assert(whiteKnight instanceof Knight);

    expect(whiteKnight.move(board, new Position(2, 5))).toBe(true);
    expect(whiteKnight.move(board, new Position(1, 3))).toBe(true);
    expect(whiteKnight.move(board, new Position(2, 1))).toBe(true);
    expect(whiteKnight.move(board, new Position(4, 0))).toBe(true);
});