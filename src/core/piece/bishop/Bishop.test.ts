import {assert, expect, test} from "vitest";
import Board from "../../board/Board";
import Position from "../../Position";
import Bishop from "./Bishop";
import EColor from "../../enum/EColor";
import Pawn from "../pawn/Pawn";


test("first move test", () =>
{
    const x = 2;
    const y = 0;

    const board = new Board();
    const piece = board.getPieceAt(new Position(x, y));
    assert(piece != null);

    expect(piece).instanceof(Bishop);
    expect(piece.color).toBe(EColor.Black);

    const moveablePositions = piece.getMovablePositions(board);
    expect(moveablePositions.length == 0);

    const invalidPosition = new Position(x + 1, y + 2);
    expect(piece.move(board, invalidPosition)).toBe(false);
});


test("first kill", () =>
{
    const board = new Board();

    const blackPawn = board.getPieceAt(new Position(3, 1));
    assert(blackPawn != null);
    expect(blackPawn).instanceof(Pawn);

    expect(blackPawn.move(board, new Position(3, 3))).toBe(true);

    const blackLeftBishop = board.getPieceAt(new Position(2, 0));
    assert(blackLeftBishop != null);

    expect(blackLeftBishop.getMovablePositions(board).length).toBe(5);

    expect(blackLeftBishop.move(board, new Position(7, 5))).toBe(true);
    expect(board.getPieceAt(new Position(2, 0))).toBeNull();
    board.print();

    expect(blackLeftBishop.getMovablePositions(board).length).toBe(6);

    expect(blackLeftBishop.move(board, new Position(6, 6))).toBe(true);
    expect(board.getPieceAt(new Position(7, 5))).toBe(null);
    expect(board.getPieceAt(new Position(6, 6))).instanceof(Bishop);
    expect(board.getPieceAt(new Position(6, 6))!.color).toBe(EColor.Black);

    board.print();
});