import Board from "../../board/Board";
import Position from "../../chess/Position";
import EColor from "../../enum/EColor";
import {Piece} from "../internal";
import EClassification from "../../enum/EClassification";

export class King extends Piece {
    constructor(position: Position, color: EColor) {
        super(position, color, color == EColor.White ? "♔" : "♚", EClassification.None);
    }

    override getMovablePositions(board: Board): Position[] {
        const curr = super.position;

        const positions: Position[] = [
            new Position(curr.x, curr.y + 1),
            new Position(curr.x + 1, curr.y + 1),
            new Position(curr.x + 1, curr.y),
            new Position(curr.x + 1, curr.y - 1),
            new Position(curr.x, curr.y - 1),
            new Position(curr.x - 1, curr.y - 1),
            new Position(curr.x - 1, curr.y),
            new Position(curr.x - 1, curr.y + 1),
        ];

        return positions.filter(p => board.isValidPosition(p) && board.getPieceAt(p)?.color != super.color);
    }
} 
