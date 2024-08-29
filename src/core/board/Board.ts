import EColor from "../enum/EColor";
import {Bishop, King, Knight, Pawn, Piece, Queen, Rook} from "../piece/internal";
import Position from "../piece/Position";
import {Grid} from "./Board.type";


export default class Board {
    static readonly SIZE = 8;
    private readonly _grid: Grid;

    constructor() {
        this._grid = [
            new Rook(new Position(0, 0), EColor.Black),
            new Knight(new Position(1, 0), EColor.Black),
            new Bishop(new Position(2, 0), EColor.Black),
            new Queen(new Position(3, 0), EColor.Black),
            new King(new Position(4, 0), EColor.Black),
            new Bishop(new Position(5, 0), EColor.Black),
            new Knight(new Position(6, 0), EColor.Black),
            new Rook(new Position(7, 0), EColor.Black),

            new Pawn(new Position(0, 1), EColor.Black),
            new Pawn(new Position(1, 1), EColor.Black),
            new Pawn(new Position(2, 1), EColor.Black),
            new Pawn(new Position(3, 1), EColor.Black),
            new Pawn(new Position(4, 1), EColor.Black),
            new Pawn(new Position(5, 1), EColor.Black),
            new Pawn(new Position(6, 1), EColor.Black),
            new Pawn(new Position(7, 1), EColor.Black),

            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,

            new Pawn(new Position(0, 6), EColor.White),
            new Pawn(new Position(1, 6), EColor.White),
            new Pawn(new Position(2, 6), EColor.White),
            new Pawn(new Position(3, 6), EColor.White),
            new Pawn(new Position(4, 6), EColor.White),
            new Pawn(new Position(5, 6), EColor.White),
            new Pawn(new Position(6, 6), EColor.White),
            new Pawn(new Position(7, 6), EColor.White),

            new Rook(new Position(0, 7), EColor.White),
            new Knight(new Position(1, 7), EColor.White),
            new Bishop(new Position(2, 7), EColor.White),
            new Queen(new Position(3, 7), EColor.White),
            new King(new Position(4, 7), EColor.White),
            new Bishop(new Position(5, 7), EColor.White),
            new Knight(new Position(6, 7), EColor.White),
            new Rook(new Position(7, 7), EColor.White),
        ];
    }

    get grid(): Grid {
        return this._grid;
    }

    getPieceAt(position: Position): Piece | null {
        if (!this.isValidPosition(position)) {
            throw `get: Invalid position: { x: ${position.x}, y: ${position.y} }`;
        }

        return this._grid[position.y * Board.SIZE + position.x];
    }

    setPieceAt(position: Position, piece: Piece | null): void {
        if (!this.isValidPosition(position)) {
            throw `set: Invalid position: { x: ${position.x}, y: ${position.y} }`;
        }

        this._grid[position.y * Board.SIZE + position.x] = piece;
    }

    isValidPosition(position: Position): boolean {
        console.assert(position != null);

        return 0 <= position.x && position.x < Board.SIZE && 0 <= position.y && position.y < Board.SIZE;
    }

    getKing(color: EColor): Piece {
        for (let y = 0; y < Board.SIZE; ++y) {
            for (let x = 0; x < Board.SIZE; ++x) {
                const piece = this.getPieceAt(new Position(x, y));
                if (piece instanceof King && piece.color == color) {
                    return piece;
                }
            }
        }

        throw "Cannot find King";
    }

    _test_print(): void {
        const s: string[] = [];

        for (let y = 0; y < this._grid.length; y++) {
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
            for (let x = 0; x < Board.SIZE; ++x) {
                this._grid[y * Board.SIZE + x] = null;
            }
        }
    }
}