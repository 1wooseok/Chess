import Position from "../chess/Position.ts";
import EColor from "../enum/EColor.ts";
import Piece from "./Piece.ts";


export default class Pawn extends Piece {
  private _isFirstMove: boolean;

  constructor(position: Position, color: EColor) {
    super(position, color);

    this._isFirstMove = true;

    console.log(this._isFirstMove); // TODO: remove;
  }

  // public override move(): void {
  //   const movableSteps: number = this._isFirstMove ? 2 : 1;

  //   console.log(movableSteps);

  //   if (this._isFirstMove) {
  //     this._isFirstMove = false;
  //   }
  // }

}