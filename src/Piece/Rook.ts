import Board from "../chess/Board.ts";
import Position from "../chess/Position.ts";
import EColor from "../enum/EColor.ts";
import Piece from "./Piece.ts";

export default class Rook extends Piece {
  constructor(position: Position, color: EColor) {
    super(position, color);
  }

  public override getMovablePositions(board: (Piece | null)[][]): Position[] {
    const positions: Position[] = [];

    this.addPosition(board, positions, 0, 1);
    this.addPosition(board, positions, 0, -1);
    this.addPosition(board, positions, 1, 0);
    this.addPosition(board, positions, -1, 0);

    return positions;
  }

  private addPosition(board: (Piece | null)[][], positions: Position[], dx: number, dy: number): void {
    let x: number = super.position.x + dx;
    let y: number = super.position.y + dy;

    while (x >= 0 && x < Board.SIZE && y >= 0 && y < Board.SIZE) {
      const piece: Piece | null = board[y][x];

      if (piece != null) {
        if (piece.color !== super.color) {
          positions.push(new Position(x, y));
        }
        
        return;
      }

      positions.push(new Position(x, y));
      x += dx;
      y += dy;
    }
  }
}