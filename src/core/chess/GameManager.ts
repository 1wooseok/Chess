import EColor from "../enum/EColor";
import EGameStatus from "../enum/EGameStatus";
import Board from "../board/Board";
import {Grid} from "../board/Board.type";
import {Bishop, Knight, Piece, Queen, Rook} from "../piece/internal";
import Position from "../piece/Position";
import Referee from "../referee/Referee";
import EPromotionOptions from "../enum/EPromotionOptions";

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
    private readonly observers: Observer[] = [];
    private readonly _deadPieces: Piece[] = [];
    private _status: EGameStatus = EGameStatus.None;
    private _moveCount: number = 1;

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

    onMove(piece: Piece, destination: Position): void {
        const deadPiece = this._board.getPieceAt(destination);
        if (deadPiece != null) {
            console.assert(deadPiece.color != piece.color);
            this._deadPieces.push(deadPiece);
        }

        // move
        piece.move(this._board, destination);

        // special skill
        if (Referee.instance.canPromotion(piece)) {
            // TODO: HACK ( `promotion`만 따로 if 처리하는게 좀 거슬림 )
            this._status = EGameStatus.Promotion;
            this.notifyChange();

            return;
        }

        this.update();
    }

    promotion(targetPiece: Piece, promotionOption: EPromotionOptions): void {
        console.assert(Referee.instance.canPromotion(targetPiece));

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
        // update game status
        const opponent = this.currentPlayer == EColor.White ? EColor.Black : EColor.White;
        this._status = this.calcGameStatus(this._board, opponent);

        // cleanup
        ++this._moveCount;

        // ui update
        this.notifyChange();
    }

    private calcGameStatus(board: Board, color: EColor): EGameStatus {
        const referee = Referee.instance;

        // draw
        if (referee.isStalemate(board, color) || referee.isLackOfPiece(board)) {
            return EGameStatus.Draw;
        }

        // result
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