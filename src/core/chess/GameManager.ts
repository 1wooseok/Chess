import EColor from "../enum/EColor";
import EGameStatus from "../enum/EGameStatus";
import Board from "../board/Board";
import {Grid} from "../board/Board.type";
import {Piece} from "../piece/internal";
import Position from "./Position";
import Referee from "./Referee";

// TODO:
export type Observer = (grid: Grid, color: EColor, gameStatus: EGameStatus) => void;

export default class GameManager {
    private static _instance: GameManager | null = null;
    private readonly _board: Board = new Board();
    private _status: EGameStatus = EGameStatus.None;
    private _moveCount: number = 1;
    // TODO: selected를 저장하는게 맞는건지 모르겠음
    private _selectedPiece: Piece | null = null;
    private _selectedPosition: Position | null = null;
    private observers: Observer[] = [];
    private readonly _deadPieces: Piece[] = [];

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
        if (this._selectedPiece == null || this._selectedPosition == null) {
            throw "이동할 체스말과 목적지가 제대로 선택되지 않음.";
        }
        // move
        const target = this._board.getPieceAt(this._selectedPosition);
        if (target != null) {
            this._deadPieces.push(target);
        }
        this._selectedPiece.move(this._board, this._selectedPosition);

        // update status
        const opponent = this.currentPlayer == EColor.White ? EColor.Black : EColor.White;
        this._status = this.calcGameStatus(this._board, opponent);

        // clear
        this._selectedPiece = null;
        this._selectedPosition = null;
        ++this._moveCount;

        // pub/sub
        this.notifyChange();
    }

    private calcGameStatus(board: Board, color: EColor): EGameStatus {
        const referee = Referee.instance;

        const isStalemate = referee.isStalemate(board, color);
        if (isStalemate) {
            return EGameStatus.Draw;
        }

        const isCheck = referee.isCheck(board, color);
        if (isCheck) {
            if (referee.isCheckmate(board, color)) {
                return EGameStatus.Checkmate;
            }

            return EGameStatus.Check;
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