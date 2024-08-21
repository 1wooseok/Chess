import Board from "../../board/Board";
import Position from "../../Position";
import EColor from "../../enum/EColor";
import Piece from "../Piece";

export default class King extends Piece {
    constructor(position: Position, color: EColor) {
        super(position, color, color == EColor.White ? "♔" : "♚");
    }

    override getMovablePositions(board: Board): Position[] {
        const deltas: Position[] = [
            new Position(0, 1),
            new Position(0, -1),
            new Position(1, 0),
            new Position(1, 1),
            new Position(1, -1),
            new Position(-1,0),
            new Position(-1,1),
            new Position(-1,-1),
        ];

        return deltas.filter(p => board.isValidPosition(p));
    }
} 
