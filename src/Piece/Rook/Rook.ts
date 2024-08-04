import Board from "../../chess/board/Board";
import Position from "../../chess/Position";
import EColor from "../../enum/EColor";
import Piece from "../Piece";

export default class Rook extends Piece {
    constructor(position: Position, color: EColor) {
        super(position, color, color === EColor.White ? "♖" : "♜");
    }

    override getMovablePositions(board: Board): Position[] {
        const north = this.traverseDirection(board, 0, 1);
        const south = this.traverseDirection(board, 0, -1);
        const east = this.traverseDirection(board, 1, 0);
        const west = this.traverseDirection(board, -1, 0);

        return north.concat(south, east, west);
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
                    positions.push(new Position(x, y));
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