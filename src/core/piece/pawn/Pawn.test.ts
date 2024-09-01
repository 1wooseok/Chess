import {assert, expect, test} from "vitest";
import Board from "../../board/Board";
import Position from "../Position";
import {Pawn} from "../internal";
import EColor from "../../enum/EColor";


test("Pawn은 처음만 2칸 전진 가능", () =>
{
    const x = 0;
    const y = 1;

    const board = new Board();
    const piece = board.getPieceAt(new Position(x, y));
    assert(piece != null);

    expect(piece).instanceof(Pawn);

    const moveablePositions = piece.getMovableAndAttackableAndSafePositions(board);
    expect(moveablePositions.length == 2);

    const nextPosition = new Position(x, y + 2);
    expect(piece.move(board, nextPosition)).toBe(null);
    expect(piece.position.equals(nextPosition)).toBe(true);

    board._test_print();
});

test("Pawn은 대각선만 공격 가능", () =>
{
    const board = new Board();

    // white
    const whitePawn = board.getPieceAt(new Position(1, 6));
    assert(whitePawn != null);
    expect(whitePawn).instanceof(Pawn);
    expect(whitePawn.color).toBe(EColor.White);
    expect(whitePawn.move(board, new Position(1, 4))).toBe(null);

    // black
    const blackPawn = board.getPieceAt(new Position(0, 1));
    assert(blackPawn != null);
    expect(blackPawn).instanceof(Pawn);
    expect(blackPawn.color).toBe(EColor.Black);
    expect(blackPawn.move(board, new Position(0, 3))).toBe(null);

    const blackPawn2 = board.getPieceAt(new Position(1, 1));
    assert(blackPawn2 != null);
    expect(blackPawn2).instanceof(Pawn);
    expect(blackPawn2.color).toBe(EColor.Black);
    expect(blackPawn2.move(board, new Position(1, 3))).toBe(null);

    board._test_print();

    const whiteMovablePositions = whitePawn.getMovableAndAttackableAndSafePositions(board);
    expect(whiteMovablePositions.length).toBe(1);

    whitePawn.move(board, new Position(0, 3));
    expect(board.getPieceAt(new Position(0, 3))?.color).toBe(EColor.White);
    expect(board.getPieceAt(new Position(1, 4))).toBeNull();

    board._test_print();
});