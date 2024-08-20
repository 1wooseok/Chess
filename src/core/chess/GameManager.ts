import EColor from "../enum/EColor";
import EGameStatus from "../enum/EGameStatus";
import Board from "../board/Board";
import {Grid} from "../board/type";
import Piece from "../piece/Piece";
import Position from "../Position";
import King from "../piece/king/King";

export type Observer = (grid: Grid, color: EColor) => void;

export default class GameManager {
    private static _instance: GameManager | null = null;
    private readonly _board: Board = new Board();
    private _status: EGameStatus = EGameStatus.None;
    private _moveCount: number = 1;
    // TODO: 이렇게 처리하는게 맞는건지 모르겠음
    private _selectedPiece: Piece | null = null;
    private _selectedPosition: Position | null = null;
    private observers: Observer[] = [];
    private _deadPieces: Piece[] = [];

    private constructor() {
    }

    static get instance(): GameManager {
        if (GameManager._instance == null) {
            GameManager._instance = new GameManager();
        }

        return GameManager._instance;
    }

    get board(): Board {
        return this._board;
    }

    get currentPlayer(): EColor {
        return (this._moveCount & 1) == 1 ? EColor.White : EColor.Black;
    }

    get status(): EGameStatus {
        return this._status;
    }

    get moveCount(): number {
        return this._moveCount;
    }

    get deadPieces(): Piece[] {
        return this._deadPieces;
    }

    set selectedPiece(value: Piece | null) {
        this._selectedPiece = value;
    }

    set selectedPosition(value: Position | null) {
        this._selectedPosition = value;
    }

    update(): void {
        console.assert(this._selectedPosition != null, { selectedPosition: this._selectedPosition });
        console.assert(this._selectedPiece != null, { selectedPiece: this._selectedPiece });

        const target = this._board.getPieceAt(this._selectedPosition!);
        if (target != null) {
            this._deadPieces.push(target);
        }
        this._selectedPiece!.move(this.board, this._selectedPosition!);
        this.clearFrame();
    }

    private checkStatus(): void {
        // 게임 상태는 move 이후에 결정됨.
        if (this.isCheck()) {
            this._status = EGameStatus.Check;
        } else if (this.isCheckMate()) {
            this._status = EGameStatus.Checkmate;
        }
            // 최근 움직인 말의 movable position에 상대방의 king이 있는 경우
            //
    }

    subscribe(observer: Observer): void {
        this.observers.push(observer);
    }

    private notifyChange(): void {
        for (const observer of this.observers) {
            observer(this.board.grid, this.currentPlayer);
        }
    }

    private clearFrame(): void {
        ++this._moveCount;
        this._selectedPiece = null;
        this._selectedPosition = null;
        this.notifyChange();
    }

    // TODO: 어떤 말이 움직일때, 그 위치로 갓을때 check가 되는지 확인해서 ealry exit 해야 함.
    // 1. 말을 drop 했을떄 check가 되는 위치인 경우 취소시키는 방법 ( 자기 위치에 다시 놧을때랑 같은느낌 )
    // 2. 각 piece의 getMovablePositions 함수에서 애초에 check가 되는 위치는 걸러서 화면에 보여주는 방법.
    isCheck(): boolean {
        console.assert(this._selectedPiece != null);
        console.assert(this._selectedPiece!.position.isSame(this._selectedPosition!));

        const movablePositions = this._selectedPiece!.getMovablePositions(this._board);

        return movablePositions.some((position) => {
            const targetPieceOrNull = this._board.getPieceAt(position);

            return targetPieceOrNull != null && targetPieceOrNull.color != this._selectedPiece?.color && targetPieceOrNull instanceof King;
        });
    }

    private isCheckMate(): boolean {
        console.assert(this._status == EGameStatus.Check);
        console.assert(this._selectedPosition != null);
        // 더이상 갈수있는 곳이 없을때 이긴 함.
        // 움직일 수 있는 곳을
        const king = this._board.getPieceAt(this._selectedPosition!);
        console.assert(king != null && king instanceof King, { king, selectedPosition: this._selectedPosition });

        return king!.getMovablePositions(this._board).length == 0;
    }
}