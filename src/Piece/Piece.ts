import Position from "../Position";

export default abstract class Piece {
  private _position: Position;

  constructor(position: Position) {
    this._position = position;
  }

  public getPosition(): Position {
    return this._position;
  }

  public abstract getMovablePositions(): Position[];
}

