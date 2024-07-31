import {assert, expect, test} from "vitest";
import Board from "../../chess/board/Board";
import Position from "../../chess/Position";
import Pawn from "./Pawn";
import EColor from "../../enum/EColor";


test("Pawn first move test", () =>
{
    const x = 0;
    const y = 1;

    const board = new Board();
    const piece = board.getPieceOrNull(new Position(x, y));
    assert(piece != null);

    expect(piece).instanceof(Pawn);

    const moveablePositions = piece.getMovablePositions(board);
    expect(moveablePositions.length == 2);

    const invalidPosition = new Position(x + 1, y + 3);
    expect(piece.move(board, invalidPosition)).toBe(false);

    const nextPosition = new Position(x, y + 2);
    expect(piece.move(board, nextPosition)).toBe(true);
    expect(piece.position.isSame(nextPosition)).toBe(true);

    board.print();
});

test("Pawn's first kill", () =>
{
    const board = new Board();

    // white
    const whitePawn = board.getPieceOrNull(new Position(1, 6));
    assert(whitePawn != null);
    expect(whitePawn).instanceof(Pawn);
    expect(whitePawn.color).toBe(EColor.White);
    expect(whitePawn.move(board, new Position(1, 4))).toBe(true);

    // black
    const blackPawn = board.getPieceOrNull(new Position(0, 1));
    assert(blackPawn != null);
    expect(blackPawn).instanceof(Pawn);
    expect(blackPawn.color).toBe(EColor.Black);
    expect(blackPawn.move(board, new Position(0, 3))).toBe(true);

    board.print();

    const whiteMovablePositions = whitePawn.getMovablePositions(board);
    expect(whiteMovablePositions.length).toBe(2);

    whitePawn.move(board, new Position(0, 3));
    expect(board.getPieceOrNull(new Position(0, 3))?.color).toBe(EColor.White);
    expect(board.getPieceOrNull(new Position(1, 4))).toBeNull();

    board.print();
});