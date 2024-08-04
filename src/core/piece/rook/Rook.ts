import Board from "../../board/Board";
import Position from "../../Position";
import EColor from "../../enum/EColor";
import Piece from "../Piece";

export default class Rook extends Piece {
    constructor(position: Position, color: EColor) {
        super(position, color, color === EColor.White ? "♖" : "♜");
    }

    override getMovablePositions(board: Board): Position[] {
        const top = super.traverseDirection(board, 0, 1);
        const bottom = super.traverseDirection(board, 0, -1);
        const right = super.traverseDirection(board, 1, 0);
        const left = super.traverseDirection(board, -1, 0);

        return top.concat(bottom, right, left);
    }
}