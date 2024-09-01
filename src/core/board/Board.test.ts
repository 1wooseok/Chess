import {describe, expect, test} from 'vitest';
import Board from "./Board";
import Position from "../piece/Position";
import EColor from "../enum/EColor";
import {King, Pawn, Queen, Rook} from "../piece/internal";

test("초기 상태", () => {
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


describe("stalemate test", () => {
    const board = new Board();

    test("black팀에 king을 제외한 기물이 아무것도 없는 경우", () => {
        board._test_clear();
        const blackKing = new King(new Position(0, 0), EColor.Black);
        board.setPieceAt(blackKing.position, blackKing);

        const whiteQueen = new Queen(new Position(2, 1), EColor.White);
        const whiteKing = new King(new Position(2, 4), EColor.White);
        board.setPieceAt(whiteQueen.position, whiteQueen);
        board.setPieceAt(whiteKing.position, whiteKing);

        board._test_print();

        expect(board.isStalemate(blackKing.color)).toBe(true);
    });

    test("2", () => {
        board._test_clear();

        const whiteKing = new King(new Position(1, 7), EColor.White);
        board.setPieceAt(whiteKing.position, whiteKing);

        const blackPawn = new Pawn(new Position(0, 5), EColor.Black);
        const blackKing = new King(new Position(1, 5), EColor.Black);
        board.setPieceAt(blackPawn.position, blackPawn);
        board.setPieceAt(blackKing.position, blackKing);

        expect(board.isStalemate(EColor.White)).toBe(false);

        whiteKing.move(board, new Position(0, 7));
        expect(board.isStalemate(EColor.White)).toBe(false);

        blackPawn.move(board, new Position(0, 6));
        board._test_print();
        expect(board.isStalemate(EColor.White)).toBe(true);
    });

    test("3", () => {
        board._test_clear();

        const whiteKing = new King(new Position(0, 7), EColor.White);
        const whiteRook = new Rook(new Position(7, 0), EColor.White);
        board.setPieceAt(whiteKing.position, whiteKing);
        board.setPieceAt(whiteRook.position, whiteRook);

        const blackRook1 = new Rook(new Position(1, 1), EColor.Black);
        const blackRook2 = new Rook(new Position(1, 6), EColor.Black);
        const blackPawn = new Pawn(new Position(0, 6), EColor.Black);
        const blackKing = new King(new Position(6, 6), EColor.Black);
        board.setPieceAt(blackRook1.position, blackRook1);
        board.setPieceAt(blackRook2.position, blackRook2);
        board.setPieceAt(blackPawn.position, blackPawn);
        board.setPieceAt(blackKing.position, blackKing);

        expect(board.isCheck(EColor.White)).toBe(false);

        whiteRook.move(board, new Position(7, 6));

        expect(board.isCheck(EColor.Black)).toBe(true);

        blackKing.move(board, whiteRook.position);
        expect(board.isCheck(EColor.Black)).toBe(false);

        expect(board.isStalemate(EColor.White)).toBe(true);
    });
});
