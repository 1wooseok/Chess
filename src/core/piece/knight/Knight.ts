import Board from "../../board/Board";
import Position from "../../chess/Position";
import EColor from "../../enum/EColor";
import {Piece} from "../internal";
import EClassification from "../../enum/EClassification";

export class Knight extends Piece {
    constructor(position: Position, color: EColor) {
        super(position, color, color == EColor.White ? "♘" : "♞", EClassification.Minor);
    }

    override getMovablePositions(board: Board): Position[] {
        const curr = super.position;

        const positions = [
            new Position(curr.x - 1, curr.y - 2),
            new Position(curr.x - 2, curr.y - 1),
            new Position(curr.x + 1, curr.y - 2),
            new Position(curr.x + 2, curr.y - 1),
            new Position(curr.x - 1, curr.y + 2),
            new Position(curr.x - 2, curr.y + 1),
            new Position(curr.x + 1, curr.y + 2),
            new Position(curr.x + 2, curr.y + 1),
        ];

        return positions.filter(p => board.isValidPosition(p) && board.getPieceAt(p)?.color != super.color);
    }
}