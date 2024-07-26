import EColor from "../enum/EColor.ts";
import EGameStatus from "../enum/EGameStatus.ts";


export default class ChessManager {
  private static instance: ChessManager | null = null;
  
  private _firstPlayer: EColor;
  private _status: EGameStatus;
  private _turnCount: number;
  
  private constructor() {
    this._firstPlayer = EColor.White;
    this._status = EGameStatus.None;
    this._turnCount = 0;
  }
  
  public get firstPlayer(): EColor {
    return this._firstPlayer;
  }
  
  public get status(): EGameStatus {
    return this._status;
  }
  
  public set status(value: EGameStatus) {
    this._status = value;
  }
  
  public get turnCount(): number {
    return this._turnCount;
  }

  public static getInstance(): ChessManager {
    if (this.instance == null) {
      this.instance = new ChessManager();
    }

    return this.instance;
  }
}