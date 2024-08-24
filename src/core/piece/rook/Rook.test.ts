import {assert, expect, test} from "vitest";
import Board from "../../board/Board";
import Position from "../../chess/Position";
import Piece from "../Piece";
import Rook from "./Rook";

test("Rook 이동 test", () => {
    const board: Board = new Board();

    const x = 0;
    const y = 0;
    const initialPosition: Position = new Position(x, y);
    const piece: Piece | null = board.getPieceAt(initialPosition);

    assert(piece != null);

    expect(piece).instanceof(Rook);

    const moveablePositions: Position[] = piece!.getMovableAndAttackableAndSafePositions(board);
    expect(moveablePositions).empty;

    expect(piece.position.equals(initialPosition)).toBeTruthy();
});