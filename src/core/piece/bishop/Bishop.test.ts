import {assert, expect, test} from "vitest";
import Board from "../../board/Board";
import Position from "../Position";
import {Bishop, Pawn} from "../internal";
import EColor from "../../enum/EColor";


test("이동 test", () =>
{
    const x = 2;
    const y = 0;

    const board = new Board();
    const piece = board.getPieceAt(new Position(x, y));
    assert(piece != null);

    expect(piece).instanceof(Bishop);
    expect(piece.color).toBe(EColor.Black);

    const moveablePositions = piece.getMovableAndAttackableAndSafePositions(board);
    expect(moveablePositions.length == 0);
});


test("대각선으로만 공격가능", () =>
{
    const board = new Board();

    const blackPawn = board.getPieceAt(new Position(3, 1));
    assert(blackPawn != null);
    expect(blackPawn).instanceof(Pawn);

    blackPawn.move(board, new Position(3, 3));

    const blackLeftBishop = board.getPieceAt(new Position(2, 0));
    assert(blackLeftBishop != null);


    blackLeftBishop.move(board, new Position(7, 5));
    expect(board.getPieceAt(new Position(2, 0))).toBeNull();
    board._test_print();

    blackLeftBishop.move(board, new Position(6, 6));
    expect(board.getPieceAt(new Position(7, 5))).toBe(null);
    expect(board.getPieceAt(new Position(6, 6))).instanceof(Bishop);
    expect(board.getPieceAt(new Position(6, 6))!.color).toBe(EColor.Black);

    board._test_print();
});