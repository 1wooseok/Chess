import Board from "../../board/Board";
import Position from "../../chess/Position";
import EColor from "../../enum/EColor";
import Piece from "../Piece";

export default class King extends Piece {
    constructor(position: Position, color: EColor) {
        super(position, color, color == EColor.White ? "♔" : "♚");
    }

    override getMovablePositions(board: Board): Position[] {
        const p = super.position;
        const x = p.x;
        const y = p.y;

        const deltas: Position[] = [
            new Position(x + 0, y + 1),
            new Position(x + 1, y + 1),
            new Position(x + 1, y + 0),
            new Position(x + 1, y - 1),
            new Position(x + 0, y - 1),
            new Position(x - 1, y - 1),
            new Position(x - 1, y + 0),
            new Position(x - 1, y + 1),
        ];

        return deltas.filter(p => board.isValidPosition(p) && board.getPieceAt(p)?.color != super.color);
    }
} 
