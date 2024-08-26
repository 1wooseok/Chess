import Board from "../board/Board";
import EColor from "../enum/EColor";
import Position from "../piece/Position";
import EClassification from "../enum/EClassification";
import {Pawn, Piece} from "../piece/internal";

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

                            piece.simulateMove(board, mv);
                            if (king.getMovableAndAttackableAndSafePositions(board).length > 0) {
                                canEscapeCheck = true;
                            }
                            piece.simulateMove(board, returnPosition);
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

    canPromotion(piece: Piece): boolean {
        const endLine = piece.color == EColor.White ? 0 : Board.SIZE - 1;

        return piece instanceof Pawn && piece.position.y == endLine;
    }
}