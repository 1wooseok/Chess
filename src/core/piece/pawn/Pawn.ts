import Board from "../../board/Board";
import Position from "../../chess/Position";
import EColor from "../../enum/EColor";
import Piece from "../Piece";


export default class Pawn extends Piece {
    private _isFirstMove: boolean;

    constructor(position: Position, color: EColor) {
        super(position, color, color == EColor.White ? "♙" : "♟");

        this._isFirstMove = true;
    }

    override getMovablePositions(board: Board): Position[] {
        const result: Position[] = [];
        const x = super.position.x;
        const y = super.position.y;
        const dy = super.color == EColor.White ? -1 : 1;
        const forward = new Position(x, y + dy);

        if (board.isValidPosition(forward) && board.getPieceAt(forward) == null) {
            result.push(forward);

            const doubleForward = new Position(x, y + (2 * dy));
            if (this._isFirstMove && board.isValidPosition(doubleForward) && board.getPieceAt(doubleForward) == null) {
                result.push(doubleForward);
            }
        }

        return result;
    }

    override getAttackablePositions(board: Board): Position[] {
        const result: Position[] = [];
        const x = super.position.x;
        const y = super.position.y;
        const dy = super.color == EColor.White ? -1 : 1;

        const diagonalLeft = new Position(x - 1, y + dy);
        if (board.isValidPosition(diagonalLeft)) {
            const piece = board.getPieceAt(diagonalLeft);
            if (piece != null && piece.color != super.color) {
                result.push(diagonalLeft);
            }
        }

        const diagonalRight = new Position(x + 1, y + dy);
        if (board.isValidPosition(diagonalRight)) {
            const piece = board.getPieceAt(diagonalRight);
            if (piece != null && piece.color != super.color) {
                result.push(diagonalRight);
            }
        }

        return result;
    }

    override move(board: Board, nextPosition: Position): boolean {
        const success = super.move(board, nextPosition);
        // FIXME: 실제로 안움직이고 내려놨을떄 버그 수정
        //  시뮬레이션 움직임도 있기때문에, 그것때문에 first move가 깨지는 상황 발생.
        if (success) {
            this._isFirstMove = false;
        }

        return success;
    }

    override simulateMove(board: Board, nextPosition: Position): boolean {
        return super.move(board, nextPosition);
    }
}