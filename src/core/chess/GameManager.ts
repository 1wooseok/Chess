import EColor from "../enum/EColor";
import EGameStatus from "../enum/EGameStatus";
import Board from "../board/Board";
import {Grid} from "../board/Board.type";
import {Piece} from "../piece/internal";
import Position from "./Position";
import Referee from "./Referee";

// TODO:
export type Observer = (grid: Grid, color: EColor, gameStatus: EGameStatus) => void;

// Singleton
export default class GameManager {
    private static _instance: GameManager | null = null;
    private constructor() {
    }
    static get instance(): GameManager {
        if (GameManager._instance == null) {
            GameManager._instance = new GameManager();
        }

        return GameManager._instance;
    }

    private readonly _board: Board = new Board();
    private _status: EGameStatus = EGameStatus.None;
    private _moveCount: number = 1;
    // TODO: selected를 저장하는게 맞는건지 모르겠음
    private _selectedPiece: Piece | null = null;
    private _selectedPosition: Position | null = null;
    private readonly observers: Observer[] = [];
    private readonly _deadPieces: Piece[] = [];

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
        // move
        const target = this._board.getPieceAt(this._selectedPosition!);
        if (target != null) {
            this._deadPieces.push(target);
        }
        this._selectedPiece!.move(this._board, this._selectedPosition!);

        // update game status
        const opponent = this.currentPlayer == EColor.White ? EColor.Black : EColor.White;
        this._status = this.calcGameStatus(this._board, opponent);

        // cleanup
        this._selectedPiece = null;
        this._selectedPosition = null;
        ++this._moveCount;

        // pub/sub
        this.notifyChange();
    }

    private calcGameStatus(board: Board, color: EColor): EGameStatus {
        const referee = Referee.instance;

        if (referee.isStalemate(board, color) || referee.isLackOfPiece(board)) {
            return EGameStatus.Draw;
        }

        if (referee.isCheck(board, color)) {
            return referee.isCheckmate(board, color) ? EGameStatus.Checkmate : EGameStatus.Check;
        }

        return EGameStatus.None;
    }

    subscribe(observer: Observer): void {
        this.observers.push(observer);
    }

    private notifyChange(): void {
        for (const observer of this.observers) {
            observer(this.board.grid, this.currentPlayer, this._status);
        }
    }
}