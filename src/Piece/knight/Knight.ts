import Board from "../../chess/board/Board";
import Position from "../../chess/Position";
import EColor from "../../enum/EColor";
import Piece from "../Piece";

export default class Knight extends Piece {
    constructor(position: Position, color: EColor) {
        super(position, color, color === EColor.White ? "♘" : "♞");
    }

    override getMovablePositions(board: Board): Position[] {
        console.log(board);
        return [];
    }
}