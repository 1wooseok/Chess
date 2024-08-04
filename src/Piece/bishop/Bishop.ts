import Board from "../../chess/board/Board";
import Position from "../../chess/Position";
import EColor from "../../enum/EColor";
import Piece from "../Piece";

export default class Bishop extends Piece {
    constructor(position: Position, color: EColor) {
        super(position, color, color === EColor.White ? "♗" : "♝");
    }

    override getMovablePositions(board: Board): Position[] {
        const diagonalTopLeft = this.traverseDirection(board, -1, 1);
        const diagonalTopRight = this.traverseDirection(board, 1, 1);
        const diagonalBottomLeft = this.traverseDirection(board, -1, -1);
        const diagonalBottomRight = this.traverseDirection(board, 1, -1);

        return diagonalTopLeft.concat(diagonalTopRight, diagonalBottomLeft, diagonalBottomRight);
    }

    private traverseDirection(board: Board, dx: number, dy: number): Position[] {
        const positions: Position[] = [];

        let x = super.position.x + dx;
        let y = super.position.y + dy;

        while (board.isValidPosition(new Position(x, y))) {
            const p = new Position(x, y);
            const piece = board.getPieceOrNull(p);

            if (piece != null) {
                if (piece.color !== super.color) {
                    positions.push(p);
                }

                break;
            }

            positions.push(p);
            x += dx;
            y += dy;
        }

        return positions;
    }
}