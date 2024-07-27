import Position from "../chess/Position.ts";
import EColor from "../enum/EColor.ts";


export default abstract class Piece {
  private readonly _color: EColor;
  private _position: Position;
  private _isAlive: boolean;

  constructor(position: Position, color: EColor) {
    this._color = color;
    this._position = position;
    this._isAlive = true;
  }

  public get color(): EColor {
    return this._color;
  }

  public get position(): Position {
    return this._position;
  }

  public set position(position: Position) {
    this._position = position;
  }

  public get isAlive(): boolean {
    return this._isAlive;
  }

  public set isAlive(value: boolean) {
    if (this._isAlive == false && value) {
      throw "promotion 기능이 없으면, 죽은 말 부활 불가.";
    }

    this._isAlive = value;
  }
  
  public kill(other: Piece): void { // TODO: public vs protected
    other._isAlive = false;
  }

  // 비어 있는 칸이나 상대방의 기물이 차지하는 칸으로 이동할 수 있으며, 해당 칸의 상대방 기물은 포획되어 제거된다.
  // public abstract move(): void;
  public abstract getMovablePositions(board: (Piece | null)[][]): Position[];
}

