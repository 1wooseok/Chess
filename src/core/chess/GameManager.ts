import EColor from "../enum/EColor";
import EGameStatus from "../enum/EGameStatus";
import Board from "../board/Board";
import Position from "../Position";
import Piece from "../piece/Piece";
import King from "../piece/king/King";

export default class GameManager {
    private static _instance: GameManager | null = null;
    private _board: Board;
    private _status: EGameStatus = EGameStatus.None;
    private _moveCount: number = 1;
    private readonly _deadPieces: Piece[] = [];

    private constructor(board: Board) {
        this._board = board;
    }

    static createInstance(board: Board): void {
        console.assert(GameManager._instance == null);

        GameManager._instance = new GameManager(board);
    }

    static get instance(): GameManager {
        if (GameManager._instance == null) {
            throw "No instance was created before get()";
        }

        return GameManager._instance;
    }

    static deleteInstance(): void {
        console.assert(GameManager._instance != null);

        GameManager._instance = null;
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

    set status(value: EGameStatus) {
        this._status = value;
    }

    get moveCount(): number {
        return this._moveCount;
    }

    // move ->
    // TODO: move piece vs board
    // * move를 piece에서 했을떄의 장점
    //  1. 코드가 깔끔해진다. ( 자신의 상태를 자기가 책임진다고 보는 개념 )
    // 1.
    movePiece(from: Position, to: Position): boolean {
        //#region 1. move
        // const curr = this.board.getPieceAt(from)!;
        // console.assert(curr != null, { target: curr, from });
        // const target = this.board.getPieceAt(to);
        // if (target != null) {
        //     this._deadPieces.push(target);
        // }
        // this._board.setPieceAt(to, curr);

        const piece = this.board.getPieceAt(from);
        console.assert(piece != null, { target: piece, from });

        const success = piece!.move(this.board, to);
        if (success) {
            this.update(piece!, to);
        }

        return success;
        //#endregion
    }

    // * board에서 move했을떄
    //  1. move queue 같은게 필요함.
    //  2. 죽은 말을 보관할 수 있음.
    //  3. update 순서를 한곳에서 관리할 수 있음.
    //  4. move할때 game status도 같이 계산해서 불필요한 반복 줄일 수 있음. ( 보드 전체 순회 vs movable-position 만 순회 )
    update(piece: Piece, nextPosition: Position) {

        //#region 2. check game status
        const isKingDead = Boolean(this._deadPieces.find((p) => p instanceof King));
        if (isKingDead) {
            this._status = EGameStatus.Over;
            return;
        }

        const movablePositions = curr!.getMovablePositions(this.board);
        const isCheckmate = curr instanceof King && movablePositions.length == 0;
        if (isCheckmate) {
            this._status = EGameStatus.Checkmate;
        }
        for (const position of movablePositions) {
            const piece = this._board.getPieceAt(position);
            console.assert(piece == null || piece.color != this.currentPlayer);
            const isKing = piece != null && piece instanceof King;
            if (isKing) {
                this._status = EGameStatus.Check;
            }
        }

        // TODO: stale mate
        // TODO: 50 move rule
        //#endregion

        ++this._moveCount;
    }
}