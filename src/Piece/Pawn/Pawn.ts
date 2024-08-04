import Board from "../../chess/board/Board";
import Position from "../../chess/Position";
import EColor from "../../enum/EColor";
import Piece from "../Piece";


export default class Pawn extends Piece {
    private _isFirstMove: boolean;

    constructor(position: Position, color: EColor) {
        super(position, color, color === EColor.White ? "♙" : "♟");

        this._isFirstMove = true;
    }

    override getMovablePositions(board: Board): Position[] {
        const movablePositions: Position[] = [];
        const x = super.position.x;
        const y = super.position.y;
        const dy = super.color === EColor.White ? -1 : 1;

        const forward = new Position(x, y + dy);
        if (board.isValidPosition(forward) && board.getPieceOrNull(forward) == null) {
            movablePositions.push(forward);

            const doubleForward = new Position(x, y + 2 * dy);
            if (this._isFirstMove && board.isValidPosition(doubleForward) && board.getPieceOrNull(doubleForward) == null) {
                movablePositions.push(doubleForward);
            }
        }

        const diagonalLeft = new Position(x - 1, y + dy);
        if (board.isValidPosition(diagonalLeft)) {
            const piece = board.getPieceOrNull(diagonalLeft);
            if (piece != null && piece.color !== super.color) {
                movablePositions.push(diagonalLeft);
            }
        }

        const diagonalRight = new Position(x + 1, y + dy);
        if (board.isValidPosition(diagonalRight)) {
            const piece = board.getPieceOrNull(diagonalRight);
            if (piece != null && piece.color !== super.color) {
                movablePositions.push(diagonalRight);
            }
        }

        return movablePositions;
    }


    override move(board: Board, nextPosition: Position): boolean {
        const success = super.move(board, nextPosition);
        if (success) {
            this._isFirstMove = false;
        }

        return success;
    }
}