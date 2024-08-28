import Board from "../board/Board";
import Position from "./Position";
import EColor from "../enum/EColor";
import Referee from "../referee/Referee";
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

    move(board: Board, destination: Position): boolean {
        board.setPieceAt(this._position, null);

        board.setPieceAt(destination, this);
        this._position.x = destination.x;
        this._position.y = destination.y;

        return true;
    }

    virtualMove(board: Board, nextPosition: Position): boolean {
        return this.move(board, nextPosition);
    }

    // `Pawn`만 예외적으로 이동위치와 공격위치가 달라짐.
    getAttackablePositions(board: Board): Position[] {
        return this.getMovablePositions(board);
    }

    // TODO: refactor
    getMovableAndAttackableAndSafePositions(board: Board): Position[] {
        // FIXME: Knight 일때 여기서 좌표 문제 터짐.
        // asjdkhfakjsdhfakesuasjv
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

            this.virtualMove(board, legalPos);
            // FIXME: 여기가 문제임.
            // 여기에서 가상 움직임을 하고나서
            // isCheck -> getAllAttackablePositions -> king.getAttackablePositions -> canCastling 이 순서로 호출되니까
            // canCastling 에서는 가상 움직임이 일어난 상태에서 검사 하기때문에 실제와 다르게 작동함.

            // -> 해결책 : icCheck 로직을 다른 클래스 메서드 끌어쓰지 않고 독립적으로 만들면 해결됨 + 재귀 문제까지 해결됨.
            if (!referee.isCheck(board, this.color)) {
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
