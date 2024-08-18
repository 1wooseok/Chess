import EColor from "../enum/EColor";
import Bishop from "../piece/bishop/Bishop";
import King from "../piece/king/King";
import Knight from "../piece/knight/Knight";
import Piece from "../piece/Piece";
import Queen from "../piece/queen/Queen";
import Rook from "../piece/rook/Rook";
import Position from "../Position";
import Pawn from "../piece/pawn/Pawn";
import {Grid} from "./type";


export default class Board {
    static readonly SIZE = 8;
    private _grid: Grid;

    constructor() {
        this._grid = new Array(Board.SIZE);
        this.initBoard();
    }

    get grid(): Grid {
        return this._grid;
    }

    getPieceAt(position: Position): Piece | null {
        if (!this.isValidPosition(position)) {
            throw `[VALIDATION ERROR]: ${position}`;
        }

        return this._grid[position.y][position.x];
    }

    setPieceAt( position: Position, piece: Piece | null): void {
        this._grid[position.y][position.x] = piece;
    }

    isValidPosition(position: Position): boolean {
        console.assert(position != null);

        return 0 <= position.x && position.x < Board.SIZE && 0 <= position.y && position.y < Board.SIZE;
    }

    private initBoard(): void {
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

    print(): void {
        const stringBuilder: string[] = [];

        for (let y = 0; y < this._grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; ++x) {
                stringBuilder.push('|');

                const p = this.getPieceAt(new Position(x, y));
                stringBuilder.push(p == null ? ' ' : p.symbol);
            }
            stringBuilder.push('|');
            stringBuilder.push('\n');
        }

        console.log(stringBuilder.join(""));
    }
}