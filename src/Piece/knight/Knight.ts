import Board from "../../chess/board/Board";
import Position from "../../chess/Position";
import EColor from "../../enum/EColor";
import Piece from "../Piece";

export default class Knight extends Piece {
    constructor(position: Position, color: EColor) {
        super(position, color, color === EColor.White ? "♘" : "♞");
    }

    override getMovablePositions(board: Board): Position[] {
        const positions: Position[] = [];

        const directions = [
            { dx: -1, dy: -2 },
            { dx: -2, dy: -1, },
            { dx: 1, dy: -2, },
            { dx: 2, dy: -1, },
            { dx: -1, dy: 2, },
            { dx: -2, dy: 1, },
            { dx: 1, dy: 2, },
            { dx: 2, dy: 1, },
        ];

        for (const d of directions) {
            const x = super.position.x + d.dx;
            const y = super.position.y + d.dy;
            const p = new Position(x, y);

            if (board.isValidPosition(p)) {
                const other = board.getPieceOrNull(p);
                if (other === null || other.color !== super.color) {
                    positions.push(new Position(x, y));
                }
            }
        }

        return positions;
    }
}