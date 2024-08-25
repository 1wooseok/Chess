import Board from "../board/Board";
import EColor from "../enum/EColor";
import Position from "./Position";

export default class Referee {
    private constructor() {
    }

    private static _instance: Referee | null = null;

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

    isCheckMate(board: Board, color: EColor): boolean {
        console.assert(this.isCheck(board, color));

        const king = board.getKing(color);
        if (king.getMovableAndAttackableAndSafePositions(board).length > 0) {
            return false;
        }

        for (let x = 0; x < Board.SIZE; ++x) {
            for (let y = 0; y < Board.SIZE; ++y) {
                const piece = board.getPieceAt(new Position(x, y));

                // 아군이 지킬 수 있는지 확인 && 아군이 공격기물 제거할 수 있는지 확인
                if (piece != null && piece.color == color) {
                    const mvs = piece.getMovableAndAttackableAndSafePositions(board);
                    if (mvs.length > 0) {
                        for (const mv of mvs) {
                            let canEscapeCheck = false;
                            const originalPiece = board.getPieceAt(mv);
                            const returnPosition = piece.position.copy();

                            piece.move(board, mv);
                            if (king.getMovableAndAttackableAndSafePositions(board).length > 0) {
                                canEscapeCheck = true;
                            }
                            piece.move(board, returnPosition);
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

    isStaleMate(board: Board, color: EColor): boolean {
        return !this.isCheck(board, color) && this.getAllMovableAndAttackableAndSafePositions(board, color).length == 0;
    }
}