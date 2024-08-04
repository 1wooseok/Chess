import Board from "../chess/board/Board";
import Position from "../chess/Position";
import EColor from "../enum/EColor";


export default abstract class Piece {
    private readonly _COLOR: EColor;
    private readonly _SYMBOL: string;

    private _position: Position;
    private _isAlive: boolean;

    protected constructor(position: Position, color: EColor, symbol: string) {
        this._COLOR = color;
        this._SYMBOL = symbol;
        this._position = position;
        this._isAlive = true;
    }

    get color(): EColor {
        return this._COLOR;
    }

    get position(): Position {
        return this._position;
    }

    get isAlive(): boolean {
        return this._isAlive;
    }

    get symbol(): string {
        return this._SYMBOL;
    }

    protected kill(other: Piece): void { // TODO:  vs protected
        other._isAlive = false;
    }

    // 비어 있는 칸이나 상대방의 기물이 차지하는 칸으로 이동할 수 있으며, 해당 칸의 상대방 기물은 포획되어 제거된다.
    move(board: Board, nextPosition: Position): boolean {
        const moveablePositions = this.getMovablePositions(board);
        if (!this.isMoveablePosition(moveablePositions, nextPosition)) {
            // TODO: Error throw vs Boolean flag
            // 1. Error Throw : 사용자가 이상한 칸에 Drag & Drop 못하게, 이벤트 처리 함수에서 early exit 로직필요
            // 2. Boolean flag : 사용자가 이상한 칸에 Drag & Drop 하는것도 허용
            console.error("[MOVE ERROR] :", nextPosition);
            return false;
        }

        const other = board.getPieceOrNull(nextPosition);
        if (other != null) {
            this.kill(other);
        }

        // TODO: 이렇게 하면 죽은 말 따로 못모을. 근데 죽은걸 저장할 필요가 있나?
        board.setPiece(this._position, null);
        this._position = nextPosition;
        board.setPiece(this._position, this);
        // TODO: x,y 값을 직접 바꾸는게 아니라, 새로훈 개체로 대채 해버리는게 더 맞는건지
        // this._position.x = nextPosition.x;
        // this._position.y = nextPosition.y;

        return true;
    }

    abstract getMovablePositions(board: Board): Position[];

    private isMoveablePosition(moveablePositions: Position[], position: Position): boolean {
        return Boolean(moveablePositions.find((p) => p.isSame(position)));
    }
}
