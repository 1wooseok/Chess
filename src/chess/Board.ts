import EColor from "../enum/EColor.ts";
import Bishop from "../piece/Bishop.ts";
import King from "../piece/King.ts";
import Knight from "../piece/Knight.ts";
import Pawn from "../piece/Pawn.ts";
import Piece from "../piece/Piece.ts";
import Queen from "../piece/Queen.ts";
import Rook from "../piece/Rook.ts";
import Position from "./Position.ts";


export default class Board {
  public static readonly SIZE = 8;

  private _board: (Piece | null)[][];
  private _isClicked: boolean;

  constructor() {
    this._isClicked = false;
    this._board = new Array(Board.SIZE);

    this.initBoard();
  }

  public get board(): (Piece | null)[][] {
    return this._board;
  }

  public onClick(position: Position): void {
    const piece: Piece | null = this._board[position.y][position.x];

    if (piece === null) {
      if (this._isClicked) {
        this._isClicked = !this._isClicked;
        
      }
      console.log(1);
    }
  }

  private initBoard(): void {
    for (let i = 0; i < Board.SIZE; ++i) {
      this._board.push(new Array(Board.SIZE));

      const color: EColor = i < 2 ? EColor.Black : EColor.White;
      for (let j = 0; j < Board.SIZE; ++j) {
        const position: Position = new Position(j, i);

        switch (i) {
          case 0:
          case 7:
            if (j == 0 || j == 7) {
              this._board[i].push(new Rook(position, color));
            } else if (j == 1 || j == 6) {
              this._board[i].push(new Knight(position, color));
            } else if (j == 2 || j == 5) {
              this._board[i].push(new Bishop(position, color));
            } else if (j == 3) {
              this._board[i].push(new King(position, color));
            } else if (j == 4) {
              this._board[i].push(new Queen(position, color));
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
}