import Board from "../board/Board";
import Position from "../chess/Position";
import EColor from "../enum/EColor";

export default abstract class Piece {
    private readonly _color: EColor;
    private readonly _symbol: string;
    private _position: Position;

    protected constructor(position: Position, color: EColor, symbol: string) {
        this._color = color;
        this._symbol = symbol;
        this._position = position;
    }

    get color(): EColor {
        return this._color;
    }

    get position(): Position {
        return this._position;
    }

    get symbol(): string {
        return this._symbol;
    }

    move(board: Board, nextPosition: Position): boolean {
        board.setPieceAt(this._position, null);
        this._position = nextPosition;
        board.setPieceAt(this._position, this);

        return true;
    }

    // TODO: rename
    calcMovablePositions(board: Board): Position[] {
        const result: Position[] = [];
        const movablePositions: Position[] = this.getMovablePositions(board);
        const kingsPosition = board.findKing(this._color).position;

        for (const movablePosition of movablePositions) {
            let flag = true;
            const tmpPiece = board.getPieceAt(movablePosition);
            const tmpPosition = this._position.copy();
            // move
            board.setPieceAt(tmpPosition, null);
            this.position.x = movablePosition.x;
            this.position.y = movablePosition.y;
            board.setPieceAt(movablePosition, this);


            const dangerousPosition = this.getPotentiallyAttackedPositions(board, this._color);
            for (const dp of dangerousPosition) {
                if (dp.isSame(kingsPosition)) {
                    flag = false;
                    break;
                }
            }

            if (flag) {
                result.push(movablePosition);
            }

            // back
            this._position.x = tmpPosition.x;
            this._position.y = tmpPosition.y;
            board.setPieceAt(tmpPosition, this);
            board.setPieceAt(movablePosition, tmpPiece);
        }


        return result;
    }

    protected abstract getMovablePositions(board: Board): Position[];
    // Pawn: (공격 위치 != 이동 위차) / 나머지: (공격 위치 == 이동 위치)
    protected getAttackablePositions(board: Board): Position[] {
        return this.getMovablePositions(board);
    }

    protected traverseDirection(board: Board, dx: number, dy: number): Position[] {
        const positions: Position[] = [];

        let x = this._position.x + dx;
        let y = this._position.y + dy;

        while (board.isValidPosition(new Position(x, y))) {
            const p = new Position(x, y);
            const piece = board.getPieceAt(p);

            if (piece != null) {
                if (piece.color != this._color) {
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

    private getPotentiallyAttackedPositions(board: Board, color: EColor): Position[] {
        const dangerousPositions: Position[] = [];

        for (let y = 0; y < Board.SIZE; ++y) {
            for (let x = 0; x < Board.SIZE; ++x) {
                const piece = board.getPieceAt(new Position(x, y));

                if (piece != null && piece != this && piece.color != color) {
                    const opponentsMovablePositions = piece.getAttackablePositions(board);
                    for (const pos of opponentsMovablePositions) {
                        dangerousPositions.push(pos);
                    }
                }
            }
        }

        return dangerousPositions;
    }
}
