import {assert, describe, expect, test} from "vitest";
import Board from "../board/Board";
import {King, Pawn, Queen, Rook} from "../piece/internal";
import Position from "./Position";
import EColor from "../enum/EColor";
import Referee from "./Referee";

describe("stalemate test", () => {
    const referee = Referee.instance;
    const board = new Board();

    test("black팀에 king을 제외한 기물이 아무것도 없는 경우", () => {
        board._test_clear();
        const blackKing = new King(new Position(0, 0), EColor.Black);
        board.setPieceAt(blackKing.position, blackKing);

        const whiteQueen = new Queen(new Position(2, 1), EColor.White);
        const whiteKing = new King(new Position(2, 4), EColor.White);
        board.setPieceAt(whiteQueen.position, whiteQueen);
        board.setPieceAt(whiteKing.position, whiteKing);


        expect(referee.isStalemate(board, blackKing.color)).toBe(true);
    });

    test("2", () => {
        board._test_clear();

        const whiteKing = new King(new Position(1, 7), EColor.White);
        board.setPieceAt(whiteKing.position, whiteKing);

        const blackPawn = new Pawn(new Position(0, 5), EColor.Black);
        const blackKing = new King(new Position(1, 5), EColor.Black);
        board.setPieceAt(blackPawn.position, blackPawn);
        board.setPieceAt(blackKing.position, blackKing);

        expect(referee.isStalemate(board, EColor.White)).toBe(false);

        whiteKing.move(board, new Position(0, 7));
        expect(referee.isStalemate(board, EColor.White)).toBe(false);

        blackPawn.move(board, new Position(0, 6));

        expect(referee.isStalemate(board, EColor.White)).toBe(true);
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

        expect(referee.isCheck(board, EColor.White)).toBe(false);

        assert(whiteRook.move(board, new Position(7, 6)));

        expect(referee.isCheck(board, EColor.Black)).toBe(true);

        assert(blackKing.move(board, whiteRook.position));
        expect(referee.isCheck(board, EColor.Black)).toBe(false);

        expect(referee.isStalemate(board, EColor.White)).toBe(true);
    });
});

describe("기물이 불충분한 경우 무승부 판정", () => {

});