import Board from "../board/Board";
import Position from "./Position";
import EColor from "../enum/EColor";
import EClassification from "../enum/EClassification";

export abstract class Piece {
    private readonly _position: Position;
    private readonly _color: EColor;
    private readonly _symbol: string;
    private readonly _classification: EClassification;

    protected constructor(position: Position, color: EColor, symbol: string, classification: EClassification) {
        this._position = position;
        this._color = color;
        this._symbol = symbol;
        this._classification = classification;
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

    get classification(): EClassification {
        return this._classification;
    }

    move(board: Board, destination: Position): Piece | null {
        console.assert(board.isValidPosition(destination), JSON.stringify({destination}));

        const deadPiece = board.getPieceAt(destination);
        board.setPieceAt(this._position, null);
        board.setPieceAt(destination, this);
        this._position.x = destination.x;
        this._position.y = destination.y;

        return deadPiece;
    }

    virtualMove(board: Board, destination: Position): Piece | null {
        return this.move(board, destination);
    }

    // `Pawn`만 예외적으로 이동위치와 공격위치가 달라짐.
    getAttackablePositions(board: Board): Position[] {
        return this.getMovablePositions(board);
    }

    // TODO: refactor
    getMovableAndAttackableAndSafePositions(board: Board): Position[] {
        const result: Position[] = []; // TODO: 중복제거 필요할까?
        // 1. 이동 가능 위치 + 공격 가능 위치
        const movablePositions = this.getMovablePositions(board);
        const attackablePositions = this.getAttackablePositions(board);
        const legalPositions = movablePositions.concat(attackablePositions);

        // 2. simulation 이동했을때 check 되는 위치 제외
        for (const legalPos of legalPositions) {
            const otherPiece = board.getPieceAt(legalPos);
            const myPosition = this._position.copy();

            this.virtualMove(board, legalPos);
            if (!board.isCheck(this.color)) {
                result.push(legalPos);
            }
            this.virtualMove(board, myPosition);
            board.setPieceAt(legalPos, otherPiece);
        }

        return result;
    }

    protected abstract getMovablePositions(board: Board): Position[];

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
