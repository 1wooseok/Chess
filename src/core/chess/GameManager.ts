import EColor from "../enum/EColor";
import EGameStatus from "../enum/EGameStatus";
import Board from "../board/Board";

export default class GameManager {
    private static _instance: GameManager | null = null;
    private _board: Board;
    private _status: EGameStatus;
    private _moveCount: number;

    private constructor(board: Board) {
        this._status = EGameStatus.None;
        this._moveCount = 1;
        this._board = board;
    }

    static createInstance(board: Board): void {
        console.assert(GameManager._instance === null);

        GameManager._instance = new GameManager(board);
    }

    static get instance(): GameManager {
        if (GameManager._instance === null) {
            throw "No instance was created before get()";
        }

        return GameManager._instance;
    }

    static deleteInstance(): void {
        console.assert(GameManager._instance !== null);

        GameManager._instance = null;
    }

    get board(): Board {
        return this._board;
    }

    get currentPlayer(): EColor {
        return (this._moveCount & 1) === 1 ? EColor.White : EColor.Black;
    }

    get status(): EGameStatus {
        return this._status;
    }

    set status(value: EGameStatus) {
        this._status = value;
    }

    get moveCount(): number {
        return this._moveCount;
    }

    checkGameStatus(): void {
        console.error(this._board);

        // TODO: move하고나서 현재 게임 상태를 체크함 ( 체크메이트인지 등등 )
    }

    // 현재 차례에 맞는 말들에만 event를 부여해야 함. + event 달려있는 애들 하이라이트.

    // 이때 이동 불가능한곳 or 현재 위치 선택하면 취소됨. 차례는 지나지 않음.
    // 3. 사용자가 위치 선택
    // 4. 해당위치로 이동 ( 상태 말이 있다면 kill 먼저 하고 이동 )
    // 5. 승/패 확인 checkGameStatus()
    // 6. status가 none인 경우, ++turnCount 그 이외에 승리, 무승부는 게임 끝냄.
 
}