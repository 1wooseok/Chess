import Board from "../../chess/board/Board";
import Position from "../../chess/Position";
import EColor from "../../enum/EColor";
import Piece from "../Piece";

export default class King extends Piece {
    constructor(position: Position, color: EColor) {
        super(position, color, color === EColor.White ? "♕" : "♛");
    }

    override getMovablePositions(board: Board): Position[] {
        const positions: Position[] = [];
        const dx = [0, 0, 1, 1, 1, -1, -1, -1];
        const dy = [1, -1, 0, 1, -1, 0, 1, -1];

        for (let i = 0; i < dx.length; ++i) {
            const x = super.position.x + dx[i];
            const y = super.position.y + dy[i];
            const p = new Position(x, y);

            if (board.isValidPosition(p)) {
                const other = board.getPieceOrNull(p);
                if (other === null || other.color !== super.color) {
                    positions.push(p);
                }
            }
        }

        return positions;
    }
} 
