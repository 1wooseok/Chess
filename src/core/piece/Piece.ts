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

    move(board: Board, nextPosition: Position): boolean {
        if (!this.canMoveTo(board, nextPosition)) {

            // TODO: Error throw vs Boolean flag
            // 1. Error Throw : 사용자가 이상한 칸에 Drag & Drop 못하게, 이벤트 처리 함수에서 early exit 로직필요
            // 2. Boolean flag : 사용자가 이상한 칸에 Drag & Drop 하는것도 허용
            console.error("[MOVE ERROR] :", nextPosition);
            return false;
        }

        // TODO: 이렇게 하면 죽은 말 따로 못모음.
        //  근데 죽은걸 저장할 필요가 있나?
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

    protected filterInvalidPosition(board: Board, positions: Position[]): Position[] {
        const result: Position[] = [];

        for (const d of positions) {
            const x = this.position.x + d.x;
            const y = this.position.y + d.y;
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

    private canMoveTo(board: Board, position: Position): boolean {
        return Boolean(this.getMovablePositions(board).find((p) => p.isSame(position)));
    }
}
