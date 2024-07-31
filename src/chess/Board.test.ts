import { expect, test } from 'vitest';
import Board from "./Board";
import Position from "./Position";
import Rook from "../piece/Rook";
import EColor from "../enum/EColor";
import Pawn from "../piece/Pawn";

test("print", () => {
    const board = new Board();
    board.print();
});

test("initial board state", () => {
    const board: Board = new Board();

    // Rook
    // black
    console.assert(board.grid[0][0] instanceof Rook, {first: board.grid[0][0]});
    console.assert(board.grid[0][7] instanceof Rook, {first: board.grid[0][7]});
    console.assert(board.grid[0][0]!.color == EColor.Black, {first: board.grid[0][0]});
    console.assert(board.grid[0][7]!.color == EColor.Black, {first: board.grid[0][7]});
    // White
    console.assert(board.grid[7][0] instanceof Rook, {first: board.grid[7][0]});
    console.assert(board.grid[7][7] instanceof Rook, {first: board.grid[7][7]});
    console.assert(board.grid[7][0]!.color == EColor.White, {first: board.grid[7][0]});
    console.assert(board.grid[7][7]!.color == EColor.White, {first: board.grid[7][7]});


    // Pawn
    console.assert(board.grid[1].every(p => p instanceof Pawn), {blackPawnLine: board.grid[1]});
    console.assert(board.grid[6].every(p => p instanceof Pawn), {firstLine: board.grid[6]});

    console.assert(board.grid[1].every(p => p!.color == EColor.Black), {blackPawnLine: board.grid[1]});
    console.assert(board.grid[6].every(p => p!.color == EColor.White), {firstLine: board.grid[6]});
});

test('position validation', () => {
    const board: Board = new Board();

    const x: number = 4;
    const invX: number = 100;

    const y: number = 1;
    const invY: number = -199;

    expect(board.isValidPosition(new Position(invX, y))).toBe(false);
    expect(board.isValidPosition(new Position(x, invY))).toBe(false);
    expect(board.isValidPosition(new Position(x, y))).toBe(true);
});