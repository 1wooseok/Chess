import Board from "../../board/Board";
import Position from "../Position";
import EColor from "../../enum/EColor";
import {Piece} from "../internal";
import EClassification from "../../enum/EClassification";

export class Knight extends Piece {
    public static readonly DELTAS = [
        {dx: -1, dy: -2},
        {dx: -2, dy: -1},
        {dx: +1, dy: -2},
        {dx: +2, dy: -1},
        {dx: -1, dy: +2},
        {dx: -2, dy: +1},
        {dx: +1, dy: +2},
        {dx: +2, dy: +1},
    ] as const;

    constructor(position: Position, color: EColor) {
        super(position, color, color == EColor.White ? "♘" : "♞", EClassification.Minor);
    }

    override getMovablePositions(board: Board): Position[] {
        const x = super.position.x;
        const y = super.position.y;
        const positions = Knight.DELTAS.map(({dx, dy}) => new Position(x + dx, y + dy));

        return positions.filter(p => board.isValidPosition(p) && board.getPieceAt(p)?.color != super.color);
    }
}