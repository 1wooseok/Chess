import Board from "../board/Board";
import EColor from "../enum/EColor";
import EGameStatus from "../enum/EGameStatus";
import Position from "./Position";

// 규칙: https://www.chess.com/ko/article/view/how-chess-games-can-end-8-ways-explained-ko
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

    calcGameStatus(board: Board, color: EColor): EGameStatus {
        const isCheck = this.isCheck(board, color);
        if (isCheck) {
            if (this.isCheckMate(board, color)) {
                return EGameStatus.Checkmate;
            }

            return EGameStatus.Check;
        }

        return EGameStatus.None;
    }

    isCheck(board: Board, color: EColor): boolean {
        const king = board.getKing(color);
        const opponentsAttackablePositions = this.getOpponentsAttackablePositions(board, color);

        return opponentsAttackablePositions.some(p => king.position.equals(p));
    }

    isCheckMate(board: Board, color: EColor): boolean {
        console.assert(this.isCheck(board, color));

        const king = board.getKing(color);
        // 1. 왕이 공격받지 않는 다른 칸으로 이동할 수 있는지 확인.
        if (king.getMovableAndAttackablePositions(board).length > 0) {
            return false;
        }

        for (let x = 0; x < Board.SIZE; ++x) {
            for (let y = 0; y < Board.SIZE; ++y) {
                const piece = board.getPieceAt(new Position(x, y));

                // 2. 아군 말이 공격 경로 차단할 수 있는지 확인 && 아군 말이 공격자를 제거할 수 있는지 확인
                if (piece != null && piece.color == color) {
                    const mvs = piece.getMovableAndAttackablePositions(board);
                    if (mvs.length > 0) {
                        for (const mv of mvs) {
                            let canEscapeCheck = false;
                            const originalPiece = board.getPieceAt(mv);
                            const returnPosition = piece.position.copy();

                            piece.move(board, mv);
                            if (king.getMovableAndAttackablePositions(board).length > 0) {
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

    private getOpponentsAttackablePositions(board: Board, color: EColor): Position[] {
        const result: Position[] = [];

        for (let y = 0; y < Board.SIZE; ++y) {
            for (let x = 0; x < Board.SIZE; ++x) {
                const piece = board.getPieceAt(new Position(x, y));
                const isOpponent = piece != null && piece.color != color;

                if (isOpponent) {
                    const attackablePositions = piece.getAttackablePositions(board);
                    for (const p of attackablePositions) {
                        result.push(p);
                    }
                }
            }
        }

        return result;
    }

    // ## 승/패
    // 1. 체크메이트
    // 1-1. 킹을 피하거나
    // 1-2. 아군이 킹을 지키거나
    // 1-3. 상대 기물을 잡을 수 없다면 체크메이트
// TODO: 남은 기능
    // 2. 기권
    // 3. 시간패

    // ## 무승부
    // 1. 스테일메이트
    // 체크가 아닌데도 움직일 말이 없는 경우
    // 2. 기물 부족
    // 2-1. 킹 vs 킹
    // 2-2. (킹 + 부기물(= 나이트, 비숍)) vs 킹
    // 2-3. 킹 vs 모든 기물 ( 제한시간 상관 없이 무승부 )
    // 2-4. 킹 vs (킹 + 2나이트 )
    // 3. 50수 규칙
    // 4. 3중 반복
    // 5. 합의
}