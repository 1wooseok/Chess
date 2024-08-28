import Board from "../../board/Board";
import Position from "../Position";
import EColor from "../../enum/EColor";
import {Piece} from "../internal";
import EClassification from "../../enum/EClassification";
import Referee from "../../referee/Referee";

export class King extends Piece {
    private _hasMoved: boolean = false;

    constructor(position: Position, color: EColor) {
        super(position, color, color == EColor.White ? "♔" : "♚", EClassification.None);
    }

    get hasMoved(): boolean {
        return this._hasMoved;
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

        const movablePosition = positions.filter(p => board.isValidPosition(p) && board.getPieceAt(p)?.color != super.color);

        if (Referee.instance.canKingSideCastling(board, this)) {
            const dx = 2;
            const kingSideCastlingPosition = new Position(super.position.x + dx, super.position.y);
            movablePosition.push(kingSideCastlingPosition);
        }

        if (Referee.instance.canQueenSideCastling(board, this)) {
            const dx = -2;
            const queenSideCastlingPosition = new Position(super.position.x + dx, super.position.y);
            movablePosition.push(queenSideCastlingPosition);
        }

        return movablePosition;
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

    castling(board: Board): void {
        console.assert(Referee.instance.canKingSideCastling(board, this));
        console.assert(Referee.instance.canQueenSideCastling(board, this));

        // king은 어차피 지가 알아서 움직일거고,
        // rook 만 여기서 옮겨주면 됨.

    }
}
