import Board from "../../board/Board";
import Position from "../Position";
import EColor from "../../enum/EColor";
import {Piece, Rook} from "../internal";
import EClassification from "../../enum/EClassification";
import ESide from "../../enum/ESide";

export class King extends Piece {
    static readonly DELTAS = [
        {dx: 0, dy: -1},
        {dx: 1, dy: -1},
        {dx: 1, dy: 0},
        {dx: 1, dy: 1},
        {dx: 0, dy: 1},
        {dx: -1, dy: 1},
        {dx: -1, dy: 0},
        {dx: -1, dy: -1},
    ];

    constructor(position: Position, color: EColor) {
        super(position, color, color == EColor.White ? "♔" : "♚", EClassification.None);
    }

    private hasMoved: boolean = false;

    override getMovablePositions(board: Board): Position[] {
        const x = super.position.x;
        const y = super.position.y;
        const movablePosition = King.DELTAS
            .map(({dx, dy}) => new Position(x + dx, y + dy))
            .filter(p => board.isValidPosition(p) && board.getPieceAt(p)?.color != super.color);

        if (this.canCastling(board, ESide.King)) {
            movablePosition.push(new Position(super.position.x + 2, super.position.y));
        }
        if (this.canCastling(board, ESide.Queen)) {
            movablePosition.push(new Position(super.position.x - 2, super.position.y));
        }

        return movablePosition;
    }


    override move(board: Board, destination: Position): Piece | null {
        if (this.isUsingCastling(board, destination)) {
            // TODO: x == 2 같은 상수 제거하기
            const side: ESide = destination.x == 2 ? ESide.Queen : ESide.King;
            const rook = board.getPieceAt(new Position(side == ESide.Queen ? 0 : Board.SIZE - 1, super.position.y))!;
            rook.move(board, new Position(side == ESide.Queen ? destination.x + 1 : destination.x - 1, super.position.y));
        }

        // king이 마지막에 움직여야 함.
        const deadPiece = super.move(board, destination);

        this.hasMoved = true;

        return deadPiece;
    }

    override virtualMove(board: Board, destination: Position): Piece | null {
        return super.move(board, destination);
    }

    private isUsingCastling(board: Board, destination: Position): boolean {
        if (!(this.canCastling(board, ESide.King) || this.canCastling(board, ESide.Queen))) {
            return false;
        }

        const KING_SIDE_X = Board.SIZE - 2;
        const QUEEN_SIDE_X = 2;

        return (destination.x == KING_SIDE_X) || (destination.x == QUEEN_SIDE_X);
    }

    private canCastling(board: Board, side: ESide): boolean {
        if (this.hasMoved || board.isCheck(super.color)) {
            return false;
        }

        const x = super.position.x;
        const y = super.position.y;
        const adder = side == ESide.King ? 1 : -1;
        const tmp = new Position(x + adder, y);
        const end = side == ESide.Queen ? 0 : Board.SIZE - 1;
        while (board.isValidPosition(tmp) && tmp.x != end) {
            if (board.getPieceAt(tmp) != null) {
                return false;
            }

            tmp.x += adder;
        }

        const rook = board.getPieceAt(new Position(side == ESide.Queen ? 0 : (Board.SIZE - 1), y));
        if (!(rook instanceof Rook) || rook.hasMoved) {
            return false;
        }

        let canCastling = true;
        this.virtualMove(board, new Position(x + (adder * 2), y));
        if (board.isCheck(super.color)) {
            canCastling = false;
        }
        this.virtualMove(board, new Position(x, y));
        console.assert(x == 4, JSON.stringify({x}));
        console.assert(y == (super.color == EColor.White ? 7 : 0), JSON.stringify({y}));

        return canCastling;
    }
}
