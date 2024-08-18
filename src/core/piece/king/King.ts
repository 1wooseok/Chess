import Board from "../../board/Board";
import Position from "../../Position";
import EColor from "../../enum/EColor";
import Piece from "../Piece";

export default class King extends Piece {
    constructor(position: Position, color: EColor) {
        super(position, color, color == EColor.White ? "♔" : "♚");
    }

    override getMovablePositions(board: Board): Position[] {
        const directions: Position[] = [
            new Position(0, 1),
            new Position(0, -1),
            new Position(1, 0),
            new Position(1, 1),
            new Position(1, -1),
            new Position(-1,0),
            new Position(-1,1),
            new Position(-1,-1),
        ];

        const movablePositions = super.filterInvalidPosition(board, directions);

        // 해당 위치로 갓을때 Check 상태가 되는지 확인해야 함 ( king 이 죽으면 게임 끝나기 때문에 )
        //  어쩔수 없이 적 유닛이 갈수있는 모든 위치를 탐색해야 함.
        // FIXME: 여기서 계산하는게 맞을까? 실제로 check 되는 경우는 다양한데 여기서 계산하면 로직이 커짐.
        const dangerousPositions: Position[] = [];
        for (let y = 0; y < Board.SIZE; ++y) {
            for (let x = 0; x < Board.SIZE; ++x) {
                const other = board.getPieceAt(new Position(x, y));
                if (other == null || other.color == super.color) {
                    continue;
                }

                for (const p of dangerousPositions) {
                    dangerousPositions.push(p);
                }
            }
        }

        return movablePositions.filter((p) => !dangerousPositions.some(dp => dp.isSame(p)));
    }
} 
