import Board from "../../board/Board";
import Position from "../../chess/Position";
import EColor from "../../enum/EColor";
import {Piece} from "../internal";
import EClassification from "../../enum/EClassification";

export class Rook extends Piece {
    constructor(position: Position, color: EColor) {
        super(position, color, color == EColor.White ? "♖" : "♜", EClassification.Major);
    }

    override getMovablePositions(board: Board): Position[] {
        const deltas = [
            {dx: 0, dy: 1},
            {dx: 0, dy: -1},
            {dx: 1, dy: 0},
            {dx: -1, dy: 0},
        ];

        return deltas.flatMap((d) => super.traverseDirection(board, d.dx, d.dy));
    }
}