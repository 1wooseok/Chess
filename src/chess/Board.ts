import EColor from "../enum/EColor.ts";
import Pawn from "../piece/Pawn.ts";
import Piece from "../piece/Piece.ts";
import Rook from "../piece/Rook.ts";
import Position from "./Position.ts";


export default class Board {
  private static readonly SIZE = 8;

  private _board: (Piece | null)[][] = [];

  constructor() {
    for (let i = 0; i < Board.SIZE; ++i) {
      this._board.push([]);
      // TODO: first player에 따라 색상이 달라질 수도?
      const color: EColor = i < 2 ? EColor.Black : EColor.White;

      for (let j = 0; j < Board.SIZE; ++j) {
        const position: Position = new Position(j, i);

        switch (i) {
          case 0:
          case 7:
            if (j == 0 || j == 7) {
              this._board[i].push(new Rook(position, color));
            } else if (j == 1 || j == 6) {
              // Knight
            } else if (j == 2 || j == 5) {
              // bishop
            } else if (j == 3) {
              // king
            } else if (j == 4) {
              // queen
            }
            break;
          case 1:
          case 6:
            this._board[i].push(new Pawn(position, color));
            break;
          default:
            this._board[i].push(null);
        }
      }
    }
  }

  public get board(): (Piece | null)[][] {
    return this._board;
  }

}