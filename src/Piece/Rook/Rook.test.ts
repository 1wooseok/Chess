import {assert, expect, test} from "vitest";
import Board from "../../chess/board/Board";
import Position from "../../chess/Position";
import Piece from "../Piece";
import Rook from "./Rook";

test("Rook first move test", () => {
    const board: Board = new Board();

    const x = 0;
    const y = 0;
    const initialPosition: Position = new Position(x, y);
    const piece: Piece | null = board.getPieceOrNull(initialPosition);

    assert(piece != null);

    expect(piece).instanceof(Rook);

    const moveablePositions: Position[] = piece!.getMovablePositions(board);
    expect(moveablePositions).empty;

    const invalidPosition: Position = new Position(x + 1, y + 3);
    expect(piece.move(board, invalidPosition)).toBeFalsy();

    expect(piece.position.isSame(initialPosition)).toBeTruthy();
});