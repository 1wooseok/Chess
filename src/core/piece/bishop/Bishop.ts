import Board from "../../board/Board";
import Position from "../../Position";
import EColor from "../../enum/EColor";
import Piece from "../Piece";

export default class Bishop extends Piece {
    constructor(position: Position, color: EColor) {
        super(position, color, color == EColor.White ? "♗" : "♝");
    }

    override getMovablePositions(board: Board): Position[] {
        const deltas = [[-1, 1], [1, 1], [-1, -1], [1, -1]];

        return deltas.flatMap(([x, y]) => super.traverseDirection(board, x, y));
    }
}