import {assert, expect, test} from "vitest";
import Position from "../chess/Position";
import Board from "../board/Board";
import Bishop from "./bishop/Bishop";
import EColor from "../enum/EColor";
import King from "./king/King";

test("체스말이 이동 가능한 위치 확인 테스트", () => {
    const board = new Board();

    // 1
    {
        const kingFrontWhitePawn = board.getPieceAt(new Position(4, 6));
        const expectedValue = [
            new Position(4, 5),
            new Position(4, 4),
        ];
        expect(kingFrontWhitePawn?.getMovableAndAttackableAndSafePositions(board)).toEqual(expectedValue);
        kingFrontWhitePawn?.move(board, new Position(4, 4));
        expect(board.getPieceAt(new Position(4, 6))).toBe(null);
        expect(board.getPieceAt(new Position(4, 4))).toEqual(kingFrontWhitePawn);
    }

    // 2.
    {
        const kingFrontBlackPawn = board.getPieceAt(new Position(4, 1));
        const expectedValue = [
            new Position(4, 2),
            new Position(4, 3),
        ];
        expect(kingFrontBlackPawn?.getMovableAndAttackableAndSafePositions(board)).toEqual(expectedValue);

        kingFrontBlackPawn?.move(board, new Position(4, 3));
        expect(board.getPieceAt(new Position(4, 1))).toBe(null);
        expect(board.getPieceAt(new Position(4, 3))).toEqual(kingFrontBlackPawn);
    }

    // 3.
    {
        // const
        const queenFrontWhitePawn = board.getPieceAt(new Position(3, 6));
        const expected = [
            new Position(3, 5),
            new Position(3, 4),
        ];
        expect(queenFrontWhitePawn?.getMovableAndAttackableAndSafePositions(board)).toEqual(expected);
        queenFrontWhitePawn?.move(board, new Position(3, 5));
        expect(board.getPieceAt(new Position(3, 6))).toBe(null);
        expect(board.getPieceAt(new Position(3, 5))).toEqual(queenFrontWhitePawn);
    }

    // 4.
    {
        const blackRightBishop = board.getPieceAt(new Position(5, 0));
        assert(blackRightBishop instanceof Bishop);

        const expected = [
            new Position(4, 1),
            new Position(3, 2),
            new Position(2, 3),
            new Position(1, 4),
            new Position(0, 5),
        ];
        const actual = blackRightBishop.getMovableAndAttackableAndSafePositions(board);
        for (const e of expected) {
            expect(actual.some(a => a.equals(e))).toBe(true);
        }

        blackRightBishop.move(board, new Position(1, 4));
        expect(board.getPieceAt(new Position(5, 0))).toBe(null);
        expect(board.getPieceAt(new Position(1, 4))).toEqual(blackRightBishop);
    }

    board._test_print();
    // 5
    {
        const whiteKing = board.getKing(EColor.White);
        assert(whiteKing instanceof King);
        const actual = whiteKing.getMovableAndAttackableAndSafePositions(board);

        const expected = new Position(4, 6);
        expect(actual.every(a => a.equals(expected))).toBe(true);
    }
});
