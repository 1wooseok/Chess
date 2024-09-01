import Board from "../../board/Board";
import Position from "../Position";
import EColor from "../../enum/EColor";
import {Piece} from "../internal";
import EClassification from "../../enum/EClassification";
import GameManager from "../../chess/GameManager";

export class Pawn extends Piece {
    private _hasMoved: boolean = false;
    private _firstDoubleMoveTurn: number = -99;
    private readonly CAN_EN_PASSANT_Y = super.color == EColor.White ? 3 : 4;

    constructor(position: Position, color: EColor) {
        super(position, color, color == EColor.White ? "♙" : "♟", EClassification.None);
    }

    isMovedDoubleInPrevTurn(): boolean {
        return this._firstDoubleMoveTurn == (GameManager.instance.turnCount - 1);
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

        if (this.canEnPassant(board)) {
            const enPassantTarget = this.getEnPassantTargetOrNull(board)!;
            console.assert(enPassantTarget != null);

            const dy = super.color == EColor.White ? -1 : 1;
            const position = new Position(enPassantTarget.position.x, enPassantTarget.position.y + dy);

            result.push(position);
        }

        return result;
    }

    override move(board: Board, destination: Position): Piece | null {
        const isDoubleMove = Math.abs(super.position.y - destination.y) == 2; // 움직이기 전에 검사해야 함.

        let deadPiece: Piece | null = null;
        if (this.isUsingEnPassant(board, destination)) {
            const enPassantTarget = this.getEnPassantTargetOrNull(board)!;
            board.setPieceAt(enPassantTarget.position, null);

            deadPiece = enPassantTarget;
        }

        const p = super.move(board, destination); // move 하면 위치가 바뀌기 때문에 canEnpassant에서 y값 검증 통과를 못함.
        if (p != null) {
            deadPiece = p;
        }

        if (!this._hasMoved) {
            if (isDoubleMove) {
                this._firstDoubleMoveTurn = GameManager.instance.turnCount;
            }
        }
        this._hasMoved = true;

        return deadPiece;
    }

    override virtualMove(board: Board, destination: Position): Piece | null {
        return super.move(board, destination);
    }

    private isUsingEnPassant(board: Board, destination: Position): boolean {
        if (!this.canEnPassant(board)) {
            return false;
        }

        const bottomY = super.color == EColor.White ? 1 : -1;
        const bottomPiece = board.getPieceAt(new Position(destination.x, destination.y + bottomY));

        return bottomPiece == this.getEnPassantTargetOrNull(board); // TODO: == 제대로 작동하는지 검증 필요
    }

    private canEnPassant(board: Board): boolean {
        if (super.position.y != this.CAN_EN_PASSANT_Y) {
            return false;
        }

        return this.getEnPassantTargetOrNull(board) != null;
    }

    private getEnPassantTargetOrNull(board: Board): Piece | null {
        const x = super.position.x;
        const y = super.position.y;
        const leftRight = [new Position(x - 1, y), new Position(x + 1, y)]
            .filter(p => board.isValidPosition(p))
            .map(p => board.getPieceAt(p))
            .filter(p => p instanceof Pawn
                && p.color != this.color
                && p.isMovedDoubleInPrevTurn());

        if (leftRight.length == 0) {
            return null;
        }

        console.assert(leftRight.length == 1);
        return leftRight[0]!;
    }
}