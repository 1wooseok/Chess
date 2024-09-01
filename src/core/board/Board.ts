import EColor from "../enum/EColor";
import {Bishop, King, Knight, Pawn, Piece, Queen, Rook} from "../piece/internal";
import Position from "../piece/Position";
import {Grid} from "./Board.type";
import EClassification from "../enum/EClassification";


export default class Board {
    static readonly SIZE = 8;
    private readonly _grid: Grid;

    constructor() {
        this._grid = [
            [
                new Rook(new Position(0, 0), EColor.Black),
                new Knight(new Position(1, 0), EColor.Black),
                new Bishop(new Position(2, 0), EColor.Black),
                new Queen(new Position(3, 0), EColor.Black),
                new King(new Position(4, 0), EColor.Black),
                new Bishop(new Position(5, 0), EColor.Black),
                new Knight(new Position(6, 0), EColor.Black),
                new Rook(new Position(7, 0), EColor.Black)
            ],
            [
                new Pawn(new Position(0, 1), EColor.Black),
                new Pawn(new Position(1, 1), EColor.Black),
                new Pawn(new Position(2, 1), EColor.Black),
                new Pawn(new Position(3, 1), EColor.Black),
                new Pawn(new Position(4, 1), EColor.Black),
                new Pawn(new Position(5, 1), EColor.Black),
                new Pawn(new Position(6, 1), EColor.Black),
                new Pawn(new Position(7, 1), EColor.Black),
            ],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [
                new Pawn(new Position(0, 6), EColor.White),
                new Pawn(new Position(1, 6), EColor.White),
                new Pawn(new Position(2, 6), EColor.White),
                new Pawn(new Position(3, 6), EColor.White),
                new Pawn(new Position(4, 6), EColor.White),
                new Pawn(new Position(5, 6), EColor.White),
                new Pawn(new Position(6, 6), EColor.White),
                new Pawn(new Position(7, 6), EColor.White),
            ],
            [
                new Rook(new Position(0, 7), EColor.White),
                new Knight(new Position(1, 7), EColor.White),
                new Bishop(new Position(2, 7), EColor.White),
                new Queen(new Position(3, 7), EColor.White),
                new King(new Position(4, 7), EColor.White),
                new Bishop(new Position(5, 7), EColor.White),
                new Knight(new Position(6, 7), EColor.White),
                new Rook(new Position(7, 7), EColor.White)
            ],
        ];
    }

    get grid(): Grid {
        return this._grid;
    }

    getPieceAt(position: Position): Piece | null {
        if (!this.isValidPosition(position)) {
            throw `get: Invalid position: { x: ${position.x}, y: ${position.y} }`;
        }

        return this._grid[position.y][position.x];
    }

    setPieceAt(position: Position, piece: Piece | null): void {
        if (!this.isValidPosition(position)) {
            throw `set: Invalid position: { x: ${position.x}, y: ${position.y} }`;
        }

        this._grid[position.y][position.x] = piece;
    }

    isValidPosition(position: Position): boolean {
        console.assert(position != null);
        const x = position.x;
        const y = position.y;

        return 0 <= x && x < Board.SIZE && 0 <= y && y < Board.SIZE;
    }

    getKing(color: EColor): King {
        for (let y = 0; y < Board.SIZE; ++y) {
            for (let x = 0; x < Board.SIZE; ++x) {
                const p = this.getPieceAt(new Position(x, y));
                if (p instanceof King && p.color == color) {
                    return p;
                }
            }
        }

        throw "Cannot find King";
    }

    canPromotion(color: EColor): boolean {
        const END_LINE = color == EColor.White ? 0 : Board.SIZE - 1;

        for (let x = 0; x < 0; ++x) {
            const piece = this.getPieceAt(new Position(x, END_LINE));
            if (piece instanceof Pawn && piece.color == color) {
                return true;
            }
        }

        return false;
    }

    isLackOfPiece(): boolean {
        for (let y = 0; y < Board.SIZE; ++y) {
            for (let x = 0; x < Board.SIZE; ++x) {
                const piece = this.getPieceAt(new Position(x, y));

                if (piece != null) {
                    // 팀에 상관없이 `주기물` or `pawn`이 살아있는 경우는 기물 부족에 의한 무승부 x
                    if (piece.classification == EClassification.Major || piece instanceof Pawn) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    isCheck(color: EColor): boolean {
        const king = this.getKing(color);

        if (this.checkLinear(king)) {
            return true;
        }
        if (this.checkDiagonal(king)) {
            return true;
        }
        if (this.checkKnight(king)) {
            return true;
        }
        if (this.checkPawn(king)) {
            return true;
        }
        if (this.checkKing(king)) {
            return true;
        }

        return false;
    }

    isCheckmate(color: EColor): boolean {
        console.assert(this.isCheck(color));

        const king = this.getKing(color);
        if (king.getMovableAndAttackableAndSafePositions(this).length > 0) {
            return false;
        }

        for (let x = 0; x < Board.SIZE; ++x) {
            for (let y = 0; y < Board.SIZE; ++y) {
                const piece = this.getPieceAt(new Position(x, y));

                // 아군이 왕을 지킬 수 있는지 && 공격 기물 제거할 수 있는지 확인
                if (piece != null && piece.color == color) {
                    const mvs = piece.getMovableAndAttackableAndSafePositions(this);
                    if (mvs.length > 0) {
                        for (const mv of mvs) {
                            let canEscapeCheck = false;
                            const originalPiece = this.getPieceAt(mv);
                            const returnPosition = piece.position.copy();

                            piece.virtualMove(this, mv);
                            if (king.getMovableAndAttackableAndSafePositions(this).length > 0) {
                                canEscapeCheck = true;
                            }
                            piece.virtualMove(this, returnPosition);
                            this.setPieceAt(mv, originalPiece);

                            if (canEscapeCheck) {
                                return false;
                            }
                        }
                    }
                }
            }
        }

        return true;
    }

    isStalemate(color: EColor): boolean {
        if (this.isCheck(color)) {
            return false;
        }

        for (let y = 0; y < Board.SIZE; ++y) {
            for (let x = 0; x < Board.SIZE; ++x) {
                const piece = this.getPieceAt(new Position(x, y));
                if (piece != null && piece.color == color) {
                    if (piece.getMovableAndAttackableAndSafePositions(this).length > 0) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    private checkLinear(king: King): boolean {
        const linear = [
            {dx: 0, dy: -1},
            {dx: 1, dy: 0,},
            {dx: 0, dy: 1},
            {dx: -1, dy: 0},
        ];

        for (const {dx, dy} of linear) {
            const position = king.position.copy();
            position.x += dx;
            position.y += dy;

            while (this.isValidPosition(position)) {
                const piece = this.getPieceAt(position);
                if (piece != null) {
                    if (piece.color != king.color && (piece instanceof Queen || piece instanceof Rook)) {
                        return true;
                    }

                    break;
                }

                position.x += dx;
                position.y += dy;
            }
        }

        return false;
    }

    private checkDiagonal(king: King): boolean {
        const diagonal = [
            {dx: 1, dy: -1},
            {dx: 1, dy: 1},
            {dx: -1, dy: 1},
            {dx: -1, dy: -1},
        ];

        for (const {dx, dy} of diagonal) {
            const position = king.position.copy();
            position.x += dx;
            position.y += dy;

            while (this.isValidPosition(position)) {
                const piece = this.getPieceAt(position);
                if (piece != null) {
                    if (piece.color != king.color && (piece instanceof Queen || piece instanceof Bishop)) {
                        return true;
                    }

                    break;
                }

                position.x += dx;
                position.y += dy;
            }
        }

        return false;
    }

    private checkKnight(king: King): boolean {
        for (const {dx, dy} of Knight.DELTAS) {
            const position = king.position.copy();
            position.x += dx;
            position.y += dy;

            if (!this.isValidPosition(position)) {
                continue;
            }

            const piece = this.getPieceAt(position);
            if (piece instanceof Knight && piece.color != king.color) {
                return true;
            }
        }

        return false;
    }

    private checkPawn(king: King): boolean {
        const dy = king.color == EColor.White ? -1 : 1;
        const attackPositions = [
            {dx: -1, dy: dy},
            {dx: 1, dy: dy},
        ];

        for (const {dx, dy} of attackPositions) {
            const position = king.position.copy();
            position.x += dx;
            position.y += dy;

            if (!this.isValidPosition(position)) {
                continue;
            }

            const piece = this.getPieceAt(position);
            if (piece == null || piece.color == king.color) {
                continue;
            }

            if (piece instanceof Pawn) {
                return true;
            }
        }

        return false;
    }

    private checkKing(king: King): boolean {
        for (const {dx, dy} of King.DELTAS) {
            const position = king.position.copy();
            position.x += dx;
            position.y += dy;

            if (!this.isValidPosition(position)) {
                continue;
            }

            const piece = this.getPieceAt(position);
            if (piece == null || piece.color == king.color) {
                continue;
            }

            if (piece instanceof King) {
                return true;
            }
        }

        return false;
    }

    _test_print(): void {
        const s: string[] = [];

        for (let y = 0; y < Board.SIZE; y++) {
            for (let x = 0; x < Board.SIZE; ++x) {
                s.push('|');

                const p = this.getPieceAt(new Position(x, y));
                s.push(p == null ? '  ' : p.symbol);
            }
            s.push('|\n');
        }

        console.log(s.join(""));
    }

    _test_clear(): void {
        for (let y = 0; y < this._grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; ++x) {
                this._grid[y][x] = null;
            }
        }
    }
}