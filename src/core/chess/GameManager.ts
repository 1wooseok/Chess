import EColor from "../enum/EColor";
import EGameStatus from "../enum/EGameStatus";
import Board from "../board/Board";
import {Grid} from "../board/type";
import Piece from "../piece/Piece";
import Position from "../Position";

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
    set selectedPiece(value: Piece | null) {
        this._selectedPiece = value;
    }

    set selectedPosition(value: Position | null) {
        this._selectedPosition = value;
    }

    update(): void {
        console.assert(this._selectedPosition != null, { selectedPosition: this._selectedPosition });
        console.assert(this._selectedPiece != null, { selectedPiece: this._selectedPiece });

        // const target = this._board.getPieceAt(this._selectedPosition!);
        // if (target != null) {
        //     this._deadPieces.push(target);
        // }
        this._selectedPiece!.move(this.board, this._selectedPosition!);
        this.clearFrame();
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

}