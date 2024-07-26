import Position from "../chess/Position.ts";
import EColor from "../enum/EColor.ts";
import Piece from "./Piece.ts";

export default class Rook extends Piece {
  constructor(position: Position, color: EColor) {
    super(position, color);
  }


}