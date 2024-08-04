import Board from "./chess/board/Board";
import ChessManager from "./chess/ChessManager";

function main(): void {
    ChessManager.createInstance(new Board());
}

main();