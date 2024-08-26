import Board from "../../board/Board";
import Position from "../Position";
import EColor from "../../enum/EColor";
import {Piece} from "../internal";
import EClassification from "../../enum/EClassification";

export class Queen extends Piece {
    private static readonly DELTAS = [
        {dx: 0, dy: 1},
        {dx: 0, dy: -1},
        {dx: 1, dy: 0},
        {dx: -1, dy: 0},
        {dx: -1, dy: 1},
        {dx: 1, dy: 1},
        {dx: -1, dy: -1},
        {dx: 1, dy: -1},
    ];

    constructor(position: Position, color: EColor) {
        super(position, color, color == EColor.White ? "♕" : "♛", EClassification.Major);
    }

    override getMovablePositions(board: Board): Position[] {
        return Queen.DELTAS.flatMap((d) => super.traverseDirection(board, d.dx, d.dy));
    }
}