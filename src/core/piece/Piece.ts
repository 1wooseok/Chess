import Board from "../board/Board";
import Position from "../Position";
import EColor from "../enum/EColor";

export default abstract class Piece {
    private readonly _COLOR: EColor;
    private readonly _SYMBOL: string;
    private _position: Position;

    protected constructor(position: Position, color: EColor, symbol: string) {
        this._COLOR = color;
        this._SYMBOL = symbol;
        this._position = position;
    }

    get color(): EColor {
        return this._COLOR;
    }

    get position(): Position {
        return this._position;
    }

    get symbol(): string {
        return this._SYMBOL;
    }

    abstract getMovablePositions(board: Board): Position[];

    // TODO: 이쪽 애매함.
    move(board: Board, nextPosition: Position): boolean {
        board.setPieceAt(this._position, null);
        this._position = nextPosition;
        board.setPieceAt(this._position, this);

        return true;
    }

    protected traverseDirection(board: Board, dx: number, dy: number): Position[] {
        const positions: Position[] = [];

        let x = this.position.x + dx;
        let y = this.position.y + dy;

        while (board.isValidPosition(new Position(x, y))) {
            const p = new Position(x, y);
            const piece = board.getPieceAt(p);

            if (piece != null) {
                if (piece.color != this.color) {
                    positions.push(new Position(x, y));
                }

                break;
            }

            positions.push(p);
            x += dx;
            y += dy;
        }

        return positions;
    }

    // TODO: 함수가 명확하지 않음
    protected filterInvalidPosition(board: Board, positions: Position[]): Position[] {
        const result: Position[] = [];

        for (const delta of positions) {
            const x = this.position.x + delta.x;
            const y = this.position.y + delta.y;
            const p = new Position(x, y);

            if (board.isValidPosition(p)) {
                const other = board.getPieceAt(p);
                if (other == null || other.color != this.color) {
                    result.push(p);
                }
            }
        }

        return result;
    }

    protected filterInvalidPosition2(board: Board, positions: Position[]): Position[] {
        return positions
            .map(delta => {
                const dx = this.position.x + delta.x;
                const dy = this.position.y + delta.y;
                return new Position(dx, dy);
            })
            .filter(p =>
                board.isValidPosition(p) &&
                (board.getPieceAt(p) == null || board.getPieceAt(p)?.color != this.color)
            );
    }

}
