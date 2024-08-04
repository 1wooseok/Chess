import Board from "../../board/Board";
import Position from "../../Position";
import EColor from "../../enum/EColor";
import Piece from "../Piece";

export default class Knight extends Piece {
    constructor(position: Position, color: EColor) {
        super(position, color, color === EColor.White ? "♘" : "♞");
    }

    override getMovablePositions(board: Board): Position[] {
        const directions = [
            new Position(-1, -2),
            new Position(-2, -1),
            new Position(1, -2),
            new Position(2, -1),
            new Position(-1, 2),
            new Position(-2, 1),
            new Position(1, 2),
            new Position(2, 1),
        ];

        return super.filterInvalidPosition(board, directions);
    }
}