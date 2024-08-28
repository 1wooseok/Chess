import Board from "../../board/Board";
import Position from "../Position";
import EColor from "../../enum/EColor";
import {Piece} from "../internal";
import EClassification from "../../enum/EClassification";
import GameManager from "../../chess/GameManager";
import Referee from "../../referee/Referee";


export class Pawn extends Piece {
    private _hasMoved: boolean = false;

    constructor(position: Position, color: EColor) {
        super(position, color, color == EColor.White ? "♙" : "♟", EClassification.None);
    }

    private _firstDoubleMoveTurn: number = -1;

    get firstDoubleMoveTurn(): number {
        return this._firstDoubleMoveTurn;
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
            if (!this._hasMoved && board.isValidPosition(doubleForward) && board.getPieceAt(doubleForward) == null) {
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

        if (Referee.instance.canEnPassant(board, this)) {
            const enPassantTarget = this.getEnPassantTargetOrNull(board)!;
            console.assert(enPassantTarget != null); // FIXME: HACK

            const dy = super.color == EColor.White ? -1 : 1;
            const position = new Position(enPassantTarget.position.x, enPassantTarget.position.y + dy);

            result.push(position);
        }

        return result;
    }

    override move(board: Board, nextPosition: Position): boolean {
        const isDoubleMove = Math.abs(super.position.y - nextPosition.y) == 2;
        const success = super.move(board, nextPosition);

        if (success) {
            if (!this._hasMoved && isDoubleMove) {
                this._firstDoubleMoveTurn = GameManager.instance.turnCount;
            }

            this._hasMoved = true;
        }

        return success;
    }

    override virtualMove(board: Board, nextPosition: Position): boolean {
        return super.move(board, nextPosition);
    }

    enPassant(board: Board): Piece {
        // FIXME: 예외 처리
        console.assert(Referee.instance.canEnPassant(board, this));

        const enPassantTarget = this.getEnPassantTargetOrNull(board);
        if (enPassantTarget == null) {
            throw "enPassantTarget is null";
        }
        console.assert(enPassantTarget.color != super.color);

        board.setPieceAt(enPassantTarget.position, null);

        return enPassantTarget;
    }

    // FIXME: 함수가 좀 이상함.
    // FIXME: 중복코드
    private getEnPassantTargetOrNull(board: Board): Piece | null {
        const leftRight = [
            new Position(this.position.x - 1, this.position.y),
            new Position(this.position.x + 1, this.position.y),
        ].filter(p => board.isValidPosition(p))
            .map(p => board.getPieceAt(p))
            .filter(p => p instanceof Pawn
                && p.color != this.color
                && p.firstDoubleMoveTurn == (GameManager.instance.turnCount - 1));

        if (leftRight.length == 0) {
            return null;
        }

        console.assert(leftRight.length == 1);

        return leftRight[0]!; // FIXME: 반환값도 코드를 이렇게 짜는게 말이 안됨.
    }
}