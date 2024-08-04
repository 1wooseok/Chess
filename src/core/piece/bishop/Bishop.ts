import Board from "../../board/Board";
import Position from "../../Position";
import EColor from "../../enum/EColor";
import Piece from "../Piece";

export default class Bishop extends Piece {
    constructor(position: Position, color: EColor) {
        super(position, color, color === EColor.White ? "♗" : "♝");
    }

    override getMovablePositions(board: Board): Position[] {
        const diagonalTopLeft = super.traverseDirection(board, -1, 1);
        const diagonalTopRight = super.traverseDirection(board, 1, 1);
        const diagonalBottomLeft = super.traverseDirection(board, -1, -1);
        const diagonalBottomRight = super.traverseDirection(board, 1, -1);

        return diagonalTopLeft.concat(diagonalTopRight, diagonalBottomLeft, diagonalBottomRight);
    }
}