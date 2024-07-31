import Board from "../chess/Board";
import Position from "../chess/Position";
import EColor from "../enum/EColor";
import Piece from "./Piece";

export default class Rook extends Piece {
  constructor(position: Position, color: EColor) {
    super(position, color, color === EColor.White ? "♖" : "♜");
  }

  public override getMovablePositions(board: Board): Position[] {
    const north =  this.traverseDirection(board, 0, 1);
    const south = this.traverseDirection(board, 0, -1);
    const east = this.traverseDirection(board, 1, 0);
    const west = this.traverseDirection(board, -1, 0);

    return north.concat(south, east, west);
  }

  private traverseDirection(board: Board, dx: number, dy: number): Position[] {
    const positions: Position[] = [];

    let x = super.position.x + dx;
    let y = super.position.y + dy;

    while (x >= 0 && x < Board.SIZE && y >= 0 && y < Board.SIZE) {
      const piece = board.getPieceOrNull(new Position(x, y));

      if (piece != null) {
        if (piece.color !== super.color) {
          positions.push(new Position(x, y));
        }
        
        break;
      }

      positions.push(new Position(x, y));
      x += dx;
      y += dy;
    }

    return positions;
  }
}