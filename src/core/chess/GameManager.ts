import EColor from "../enum/EColor";
import EGameStatus from "../enum/EGameStatus";
import Board from "../board/Board";
import {Grid} from "../board/Board.type";
import {Bishop, Knight, Piece, Queen, Rook} from "../piece/internal";
import Position from "../piece/Position";
import EPromotionOptions from "../enum/EPromotionOptions";

// TODO:
export type Observer = (grid: Grid, color: EColor, gameStatus: EGameStatus, deadPieces: Piece[]) => void;

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
    private readonly observers: Observer[] = [];
    private readonly _deadPieces: Piece[] = [];
    private _status: EGameStatus = EGameStatus.None;
    private _turnCount: number = 1;

    get board(): Board {
        return this._board;
    }

    get currentPlayer(): EColor {
        return (this._turnCount & 1) == 1 ? EColor.White : EColor.Black;
    }

    get status(): EGameStatus {
        return this._status;
    }

    get turnCount(): number {
        return this._turnCount;
    }

    get deadPieces(): Piece[] {
        return this._deadPieces;
    }

    replay(): void {
        // TODO:
    }

    onMove(piece: Piece, destination: Position): void {
        console.assert(this._board.isValidPosition(destination), JSON.stringify({destination}));

        const deadPiece = piece.move(this._board, destination);
        if (deadPiece != null) {
            this._deadPieces.push(deadPiece);
        }

        this.update();
    }

    // TODO: refactor
    promotion(targetPiece: Piece, promotionOption: EPromotionOptions): void {
        console.assert(this._board.canPromotion(targetPiece.color));

        const position = targetPiece.position.copy();
        const color = targetPiece.color;

        switch (promotionOption) {
            case EPromotionOptions.Queen:
                this._board.setPieceAt(position, new Queen(position, color));
                break;
            case EPromotionOptions.Rook:
                this._board.setPieceAt(position, new Rook(position, color));
                break;
            case EPromotionOptions.Knight:
                this._board.setPieceAt(position, new Knight(position, color));
                break;
            case EPromotionOptions.Bishop:
                this._board.setPieceAt(position, new Bishop(position, color));
                break;
            default:
                console.assert(false);
                break;
        }

        this.update();
    }

    private update(): void {
        if (this._board.canPromotion(this.currentPlayer)) {
            this._status = EGameStatus.Promotion;
        } else {
            const opponent = this.currentPlayer == EColor.White ? EColor.Black : EColor.White;
            this._status = this.calcGameStatus(this._board, opponent);
            ++this._turnCount;
        }

        this.notifyChange();
    }

    private calcGameStatus(board: Board, color: EColor): EGameStatus {
        // draw
        if (board.isStalemate(color) || this._board.isLackOfPiece()) {
            return EGameStatus.Draw;
        }

        // result
        if (board.isCheck(color)) {
            return board.isCheckmate(color) ? EGameStatus.Checkmate : EGameStatus.Check;
        }

        return EGameStatus.None;
    }

    subscribe(observer: Observer): void {
        this.observers.push(observer);
    }

    private notifyChange(): void {
        for (const observer of this.observers) {
            observer(this.board.grid, this.currentPlayer, this._status, this._deadPieces);
        }
    }
}