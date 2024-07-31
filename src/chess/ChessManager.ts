import EColor from "../enum/EColor";
import EGameStatus from "../enum/EGameStatus";
import Board from "./Board";

export default class ChessManager {
  private static instance: ChessManager | null = null;

  private _board: Board;
  private _status: EGameStatus;
  private _moveCount: number;
  
  private constructor(board: Board) {
    this._status = EGameStatus.None;
    this._moveCount = 1;
    this._board = board;
  }

  public static createInstance(board: Board): void {
    console.assert(ChessManager.instance === null);

    ChessManager.instance = new ChessManager(board);
  }

  public static getInstance(): ChessManager {
    if (ChessManager.instance === null) {
      throw "No instance was created before get()";
    }

    return ChessManager.instance;
  }

  public static deleteInstance(): void {
    console.assert(ChessManager.instance !== null);

    ChessManager.instance = null;
  }
  
  public get currentPlayer(): EColor {
    return (this._moveCount & 1) == 1 ? EColor.White : EColor.Black;
  }
  
  public get status(): EGameStatus {
    return this._status;
  }
  
  public set status(value: EGameStatus) {
    this._status = value;
  }
  
  public get moveCount(): number {
    return this._moveCount;
  }

  public checkGameStatus(): void {
    // 현재 player기준으로 board 전체를 훑어서 king이 패배조건에 부합하는지 확인 필요

    ++this._moveCount;
  }


  public update(): void {
    console.error(this._board);
  }
  // event 기반으로 작동함 + event를 처리하는 처리기 필요
  // 현재 차례에 맞는 말들에만 event를 부여해야 함. + event 달려있는 애들 하이라이트.
  // 말을 drag 하면, 

  // 이벤트: click, drag 지원
  // 1. 이벤트 객체를 매개변수로 받음. 
  // 2. event target이 이동 가능한 좌표 리스트 반환. ( ui 표시 )
    // 이때 이동 불가능한곳 or 현재 위치 선택하면 취소됨. 차례는 지나지 않음.
  // 3. 사용자가 위치 선택
  // 4. 해당위치로 이동 ( 상태 말이 있다면 kill 먼저 하고 이동 )
  // 5. 승/패 확인 checkGameStatus()
  // 6. status가 none인 경우, ++turnCount 그 이외에 승리, 무승부는 게임 끝냄.

}