import EColor from "../enum/EColor";
import Bishop from "../piece/Bishop";
import King from "../piece/King";
import Knight from "../piece/Knight";
import Pawn from "../piece/Pawn";
import Piece from "../piece/Piece";
import Queen from "../piece/Queen";
import Rook from "../piece/Rook";
import Position from "./Position";


export default class Board {
  public static readonly SIZE = 8;

  private readonly _grid: (Piece | null)[][];
  private _selectedPiece: Piece | null = null;

  constructor() {
    this._grid = new Array(Board.SIZE);

    this.initBoard();
  }

  public get grid(): (Piece | null)[][] {
    return this._grid;
  }

  // TODO: 이벤트 발생할때마다 호출되는지 확인 필요
  public onMoveStart(position: Position): void {
    console.log("[EVENT]: Drag start");
    const piece = this.getPieceOrNull(position);
    if (piece == null) {
      return;
    }

    this._selectedPiece = piece;
    const moveablePositions = piece.getMovablePositions(this);
    // TODO: 화면에 moveablePositions 보여주기
    console.error(moveablePositions);
  }

  public onMoveEnd(position: Position): void {
    if (this._selectedPiece == null) {
      return;
    }

    this._selectedPiece.move(this, position);
  }

  public getPieceOrNull(position: Position): Piece | null {
    if (!this.isValidPosition(position)) {
      throw `[VALIDATION ERROR]: ${position}`;
    }

    return this._grid[position.y][position.x];
  }

  public setPiece(position: Position, pieceOrNull: Piece | null): void {
    this._grid[position.y][position.x] = pieceOrNull;
  }

  public isValidPosition(position: Position): boolean {
    console.assert(position !== null);

    return 0 <= position.x && position.x < Board.SIZE && 0 <= position.y && position.y < Board.SIZE;
  }

  private initBoard(): void {
    for (let i = 0; i < Board.SIZE; ++i) {
      this._grid[i] = new Array(Board.SIZE);

      for (let j = 0; j < Board.SIZE; ++j) {
        const position: Position = new Position(j, i);
        const color: EColor = i < 2 ? EColor.Black : EColor.White;

        switch (i) {
          case 0:
          case 7:
            if (j == 0 || j == 7) {
              this._grid[i][j] = new Rook(position, color);
            } else if (j == 1 || j == 6) {
              this._grid[i][j] = new Knight(position, color);
            } else if (j == 2 || j == 5) {
              this._grid[i][j] = new Bishop(position, color);
            } else if (j == 3) {
              this._grid[i][j] = new King(position, color);
            } else if (j == 4) {
              this._grid[i][j] = new Queen(position, color);
            }
            break;
          case 1:
          case 6:
            this._grid[i][j] = new Pawn(position, color);
            break;
          default:
            this._grid[i][j] = null;
        }
      }
    }
  }

  public print(): void {
    const stringBuilder: string[] = [];

    for (let y = 0; y < this._grid.length; y++) {
      for (let x = 0; x < this.grid[y].length; ++x) {
        stringBuilder.push('|');

        const p = this.getPieceOrNull(new Position(x, y));
        stringBuilder.push(p == null ? ' ' : p.symbol);
      }
      stringBuilder.push('|');
      stringBuilder.push('\n');
    }

    console.log(stringBuilder.join(""));
  }
}