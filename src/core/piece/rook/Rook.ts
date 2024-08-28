import Board from "../../board/Board";
import Position from "../Position";
import EColor from "../../enum/EColor";
import {Piece} from "../internal";
import EClassification from "../../enum/EClassification";

export class Rook extends Piece {
    private static readonly DELTAS = [
        {dx: 0, dy: 1},
        {dx: 0, dy: -1},
        {dx: 1, dy: 0},
        {dx: -1, dy: 0},
    ];
    private _hasMoved: boolean = false;

    constructor(position: Position, color: EColor) {
        super(position, color, color == EColor.White ? "♖" : "♜", EClassification.Major);
    }

    get hasMoved(): boolean {
        return this._hasMoved;
    }

    override getMovablePositions(board: Board): Position[] {
        return Rook.DELTAS.flatMap((d) => super.traverseDirection(board, d.dx, d.dy));
    }

    override move(board: Board, nextPosition: Position): boolean {
        const success = super.move(board, nextPosition);

        if (success) {
            this._hasMoved = true;
        }

        return success;
    }

    override virtualMove(board: Board, nextPosition: Position): boolean {
        return super.move(board, nextPosition);
    }
}