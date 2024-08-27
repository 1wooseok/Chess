import {assert, describe, expect, test} from "vitest";
import Board from "../board/Board";
import {King, Knight, Pawn, Queen, Rook} from "../piece/internal";
import Position from "../piece/Position";
import EColor from "../enum/EColor";
import Referee from "./Referee";
import GameManager from "../chess/GameManager";

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

describe("특수기술 발동 가능한지 확인", () => {
    test("앙파상 테스트", () => {
        const referee = Referee.instance;
        const gameManager = GameManager.instance;
        const board = gameManager.board;

        // 앙파상 가능한 경우
        const myWhitePawn = board.getPieceAt(new Position(1, 6));
        assert(myWhitePawn instanceof Pawn);
        gameManager.onMove(myWhitePawn, new Position(1, 4));
        expect(referee.canEnPassant(board, myWhitePawn)).toBe(false);

        const blackPawn1 = board.getPieceAt(new Position(1, 1));
        assert(blackPawn1 instanceof Pawn);
        gameManager.onMove(blackPawn1, new Position(1, 2));
        expect(referee.canEnPassant(board, myWhitePawn)).toBe(false);

        gameManager.onMove(myWhitePawn, new Position(1, 3));
        expect(referee.canEnPassant(board, myWhitePawn)).toBe(false);

        const blackPawn2 = board.getPieceAt(new Position(0, 1));
        assert(blackPawn2 instanceof Pawn);
        gameManager.onMove(blackPawn2, new Position(0, 3));
        board._test_print();

        expect(referee.canEnPassant(board, myWhitePawn)).toBe(true);

        // 앙파상 가능했지만, 바로 안쓰고 몇턴 지나서 기회가 사라진 경우
        const whiteKnight = board.getPieceAt(new Position(6, 7));
        assert(whiteKnight instanceof Knight);
        gameManager.onMove(whiteKnight, new Position(7, 5));

        const blackKnight = board.getPieceAt(new Position(6, 0));
        assert(blackKnight instanceof Knight);
        gameManager.onMove(blackKnight, new Position(7, 2));

        board._test_print();

        expect(referee.canEnPassant(board, myWhitePawn)).toBe(false);
    });
});