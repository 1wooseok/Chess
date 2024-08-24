import Board from "../../board/Board";
import Position from "../../chess/Position";
import EColor from "../../enum/EColor";
import Piece from "../Piece";

export default class Knight extends Piece {
    constructor(position: Position, color: EColor) {
        super(position, color, color == EColor.White ? "♘" : "♞");
    }

    override getMovablePositions(board: Board): Position[] {
        const p = super.position;
        const x = p.x;
        const y = p.y;

        const deltas = [
            new Position(x - 1, y - 2),
            new Position(x - 2, y - 1),
            new Position(x + 1, y - 2),
            new Position(x + 2, y - 1),
            new Position(x - 1, y + 2),
            new Position(x - 2, y + 1),
            new Position(x + 1, y + 2),
            new Position(x + 2, y + 1),
        ];

        return deltas.filter(p => board.isValidPosition(p) && board.getPieceAt(p)?.color != super.color);
    }
}