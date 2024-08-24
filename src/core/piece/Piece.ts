import Board from "../board/Board";
import Position from "../chess/Position";
import EColor from "../enum/EColor";
import Referee from "../chess/Referee";

export default abstract class Piece {
    private readonly _color: EColor;
    private readonly _symbol: string;
    private readonly _position: Position;

    protected constructor(position: Position, color: EColor, symbol: string) {
        this._color = color;
        this._symbol = symbol;
        this._position = position;
    }

    get color(): EColor {
        return this._color;
    }

    get symbol(): string {
        return this._symbol;
    }

    get position(): Position {
        return this._position;
    }

    move(board: Board, nextPosition: Position): boolean {
        board.setPieceAt(this._position, null);

        board.setPieceAt(nextPosition, this);
        this._position.x = nextPosition.x;
        this._position.y = nextPosition.y;

        return true;
    }

    simulateMove(board: Board, nextPosition: Position): boolean {
        return this.move(board, nextPosition);
    }

    // 단순히 기물별로 움직일 수 있는 위치 계산하는게 아니라
    // 움직였을때 위험한 상황에 놓이는지까지 판단하고 있음.
    // 함수가 여러가지 일을 하고있어서 좀 애매함
    getMovableAndAttackableAndSafePositions(board: Board): Position[] {
        const result: Position[] = []; // TODO: 중복제거 필요할까?
        const referee = Referee.instance;
        // 1. 이동 가능 위치 + 공격 가능 위치
        const movablePositions = this.getMovablePositions(board);
        const attackablePositions = this.getAttackablePositions(board);
        const legalPositions = movablePositions.concat(attackablePositions);

        // 2. simulation 이동했을때 check 되는 위치 제외
        for (const legalPos of legalPositions) {
            const otherPiece = board.getPieceAt(legalPos);
            const myPosition = this._position.copy();

            this.simulateMove(board, legalPos);
            if (!referee.isCheck(board, this.color)) {
                result.push(legalPos);
            }
            this.simulateMove(board, myPosition);
            board.setPieceAt(legalPos, otherPiece);
        }

        return result;
    }

    protected abstract getMovablePositions(board: Board): Position[];

    getAttackablePositions(board: Board): Position[] {
        return this.getMovablePositions(board);
    }

    protected traverseDirection(board: Board, dx: number, dy: number): Position[] {
        const result: Position[] = [];
        let x = this._position.x + dx;
        let y = this._position.y + dy;
        const p = new Position(x, y);

        while (board.isValidPosition(p)) {
            const piece = board.getPieceAt(p);

            if (piece != null) {
                if (piece._color != this._color) {
                    result.push(p.copy());
                }
                break;
            }

            result.push(p.copy());

            x += dx;
            y += dy;
            p.x = x;
            p.y = y;
        }

        return result;
    }
}
