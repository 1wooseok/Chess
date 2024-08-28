import Board from "../board/Board";
import EColor from "../enum/EColor";
import Position from "../piece/Position";
import EClassification from "../enum/EClassification";
import {King, Pawn, Piece, Rook} from "../piece/internal";
import GameManager from "../chess/GameManager";

// Singleton
export default class Referee {
    private static _instance: Referee | null = null;
    private constructor() {
    }
    static get instance(): Referee {
        if (this._instance == null) {
            this._instance = new Referee();
        }

        return this._instance;
    }

    isCheck(board: Board, color: EColor): boolean {
        const king = board.getKing(color);
        const opponent = color == EColor.White ? EColor.Black : EColor.White;
        const opponentsAttackablePositions = this.getAllAttackablePositions(board, opponent);

        return opponentsAttackablePositions.some(p => king.position.equals(p));
    }

    isCheckmate(board: Board, color: EColor): boolean {
        console.assert(this.isCheck(board, color));

        const king = board.getKing(color);
        if (king.getMovableAndAttackableAndSafePositions(board).length > 0) {
            return false;
        }

        for (let x = 0; x < Board.SIZE; ++x) {
            for (let y = 0; y < Board.SIZE; ++y) {
                const piece = board.getPieceAt(new Position(x, y));

                // 아군이 왕을 지킬 수 있는지 && 공격 기물 제거할 수 있는지 확인
                if (piece != null && piece.color == color) {
                    const mvs = piece.getMovableAndAttackableAndSafePositions(board);
                    if (mvs.length > 0) {
                        for (const mv of mvs) {
                            let canEscapeCheck = false;
                            const originalPiece = board.getPieceAt(mv);
                            const returnPosition = piece.position.copy();

                            piece.virtualMove(board, mv);
                            if (king.getMovableAndAttackableAndSafePositions(board).length > 0) {
                                canEscapeCheck = true;
                            }
                            piece.virtualMove(board, returnPosition);
                            board.setPieceAt(mv, originalPiece);

                            if (canEscapeCheck) {
                                return false;
                            }
                        }
                    }
                }
            }
        }

        return true;
    }

    private getAllAttackablePositions(board: Board, color: EColor): Position[] {
        const result: Position[] = [];

        for (let y = 0; y < Board.SIZE; ++y) {
            for (let x = 0; x < Board.SIZE; ++x) {
                const piece = board.getPieceAt(new Position(x, y));
                if (piece != null && piece.color == color) {
                    const attackablePositions = piece.getAttackablePositions(board);
                    for (const p of attackablePositions) {
                        result.push(p);
                    }
                }
            }
        }

        return result;
    }

    private getAllMovableAndAttackableAndSafePositions(board: Board, color: EColor): Position[] {
        const result: Position[] = [];

        for (let y = 0; y < Board.SIZE; ++y) {
            for (let x = 0; x < Board.SIZE; ++x) {
                const piece = board.getPieceAt(new Position(x, y));
                if (piece != null && piece.color == color) {
                    const all = piece.getMovableAndAttackableAndSafePositions(board);
                    for (const p of all) {
                        result.push(p);
                    }
                }
            }
        }

        return result;
    }

    isStalemate(board: Board, color: EColor): boolean {
        return !this.isCheck(board, color) && this.getAllMovableAndAttackableAndSafePositions(board, color).length == 0;
    }

    isLackOfPiece(board: Board): boolean {
        for (let y = 0; y < Board.SIZE; ++y) {
            for (let x = 0; x < Board.SIZE; ++x) {
                const piece = board.getPieceAt(new Position(x, y));

                if (piece != null) {
                    // 팀에 상관없이 `주기물` or `pawn`이 살아있는 경우는 기물 부족에 의한 무승부 x
                    if (piece.classification == EClassification.Major || piece instanceof Pawn) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    // TODO: instanceof는 interface로 대체하고, 검증로직을 Pawn에 위치시키는게 나을지도?
    canPromotion(piece: Piece): boolean {
        if (!(piece instanceof Pawn)) {
            return false;
        }

        const endLine = piece.color == EColor.White ? 0 : Board.SIZE - 1;
        return piece.position.y == endLine;
    }

    canEnPassant(board: Board, piece: Piece): boolean {
        if (!(piece instanceof Pawn)) {
            return false;
        }

        const currY = piece.position.y;
        const yy = piece.color == EColor.White ? 3 : 4;
        if (currY != yy) {
            return false;
        }

        // FIXME: 중복코드
        const turnCount = GameManager.instance.turnCount;
        const leftRight = [
            new Position(piece.position.x - 1, piece.position.y),
            new Position(piece.position.x + 1, piece.position.y),
        ].filter(p => board.isValidPosition(p))
            .map(p => board.getPieceAt(p))
            .filter(p => p instanceof Pawn && p.color != piece.color && p.firstDoubleMoveTurn == (turnCount - 1));

        return leftRight.length > 0;
    }

    // FIXME:
    isUsingEnPassant(board: Board, color: EColor, destination: Position): boolean {
        const dy = color == EColor.White ? 1 : -1;
        const willDiePosition = new Position(destination.x, destination.y + dy);
        if (!board.isValidPosition(willDiePosition)) {
            return false;
        }

        const target = board.getPieceAt(willDiePosition);
        return target instanceof Pawn && target.color != color && target.firstDoubleMoveTurn == (GameManager.instance.turnCount - 1);
    }

    canQueenSideCastling(board: Board, king: King): boolean {
        if (king.hasMoved) { // || this.isCheck(board, king.color)
            return false;
        }

        const currX = king.position.x;
        const currY = king.position.y;
        console.assert(currX == 4, {currX});
        console.assert(currY == (king.color == EColor.White ? 7 : 0), {currY});

        const QUEEN_SIDE = -1;
        for (let x = currX + QUEEN_SIDE; x > 0; --x) {
            if (board.getPieceAt(new Position(x, currY)) != null) {
                return false;
            }
        }

        const queenSideRook = board.getPieceAt(new Position(0, currY));
        if (!(queenSideRook instanceof Rook) || queenSideRook.hasMoved) {
            return false;
        }

        let canQueenSideCastling = true;
        const castlingDestination = new Position(currX + (QUEEN_SIDE * 2), currY);
        king.virtualMove(board, castlingDestination);
        if (this.isCheck(board, king.color)) {
            canQueenSideCastling = false;
        }
        king.virtualMove(board, new Position(currX, currY));

        return canQueenSideCastling;
    }

    canKingSideCastling(board: Board, king: King): boolean {
        if (king.hasMoved) { // || this.isCheck(board, king.color)
            return false;
        }

        const KING_SIDE = 1;
        const currX = king.position.x;
        const currY = king.position.y;
        console.assert(currX == 4, {currX});
        console.assert(currY == (king.color == EColor.White ? 7 : 0), {currY});

        for (let x = currX + KING_SIDE; x < Board.SIZE - 1; ++x) {
            if (board.getPieceAt(new Position(x, currY)) != null) {
                return false;
            }
        }

        const kingSideRook = board.getPieceAt(new Position(Board.SIZE - 1, currY));
        if (!(kingSideRook instanceof Rook) || kingSideRook.hasMoved) {
            return false;
        }

        let result = true;
        const castlingDestination = new Position(currX + (KING_SIDE * 2), currY);
        debugger;
        king.virtualMove(board, castlingDestination);
        // FIXME: isCheck에서 재귀호출되서 터짐.
        if (this.isCheck(board, king.color)) {
            result = false;
        }

        king.virtualMove(board, new Position(currX, currY));

        return result;
    }
}