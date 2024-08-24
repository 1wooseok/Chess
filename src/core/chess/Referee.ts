import Board from "../board/Board";
import EColor from "../enum/EColor";
import EGameStatus from "../enum/EGameStatus";
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

        return opponentsAttackablePositions.some(p => king.position.isSame(p));
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

    // isDraw(): boolean {
    // 1. 동의에 의한 무승부 (Draw by Agreement):

    // 2, 50수 규칙 (Fifty-Move Rule):
    // 양쪽 플레이어가 연속으로 50수 동안 아무도 폰을 움직이지 않고, 상대의 기물을 잡지도 않은 경우
    // 한쪽이 50수 규칙에 따라 무승부를 선언할 수 있습니다.

    // 3. 삼중 반복 규칙 (Threefold Repetition Rule):
    // 같은 보드 상태가 세 번 반복되면 한쪽 플레이어가 무승부를 요청할 수 있습니다.
    // 차례, 기물의 위치, 움직임 가능성 등이 동일해야 함

    // 4. 물리적 기물 부족 (Insufficient Material):
    // 어느 쪽도 상대를 체크메이트할 수 있는 충분한 기물이 남아 있지 않을 경우 무승부가 선언됩니다.
    // 예를 들어, 한쪽이 왕과 나이트만 남아 있고 상대방도 왕만 남아 있을 때는 체크메이트가 불가능하므로 게임은 무승부가 됩니다.

    // 5. 서로 왕만 남은 경우 (King vs. King):
    // 양쪽 플레이어의 기물이 모두 소멸되어 서로 왕만 남은 상황에서는 체크메이트가 불가능하기 때문에 자동으로 무승부가 선언됩니다.
    // }

    // isDrawByAgreement(): boolean {
    // }
    //
    // isKingVsKing(): boolean {
    // }
    //
    // isStaleMate(): boolean {
    // }
    //
    // private isDrawAgreement(): boolean {
    // }
}