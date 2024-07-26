import Board from "./chess/Board.ts";
import EColor from "./enum/EColor.ts";
import Rook from "./piece/Rook.ts";


function main(): void {
  // document.getElementById('root')!.innerHTML = `Hello World`;

  {
    const chessBoard: Board = new Board();
    
    // TODO: 굳이 이걸 해야할까?
    // Rook
      // black
    console.assert(chessBoard.board[0][0] instanceof Rook, { first: chessBoard.board[0][0] });
    console.assert(chessBoard.board[0][7] instanceof Rook, { first: chessBoard.board[0][7] });
    console.assert(chessBoard.board[0][0]!.color == EColor.Black, { first: chessBoard.board[0][0] });
    console.assert(chessBoard.board[0][7]!.color == EColor.Black, { first: chessBoard.board[0][7] });
      // White
    console.assert(chessBoard.board[7][0] instanceof Rook, { first: chessBoard.board[7][0] });
    console.assert(chessBoard.board[7][7] instanceof Rook, { first: chessBoard.board[7][7] });
    console.assert(chessBoard.board[7][0]!.color == EColor.White, { first: chessBoard.board[7][0] });
    console.assert(chessBoard.board[7][7]!.color == EColor.White, { first: chessBoard.board[7][7] });


    // Knight
      // black
    console.assert(chessBoard.board[0][0] instanceof Rook, { first: chessBoard.board[0][0] });
    console.assert(chessBoard.board[0][7] instanceof Rook, { first: chessBoard.board[0][7] });
    console.assert(chessBoard.board[0][0]!.color == EColor.Black, { first: chessBoard.board[0][0] });
    console.assert(chessBoard.board[0][7]!.color == EColor.Black, { first: chessBoard.board[0][7] });
      // White
    console.assert(chessBoard.board[7][0] instanceof Rook, { first: chessBoard.board[7][0] });
    console.assert(chessBoard.board[7][7] instanceof Rook, { first: chessBoard.board[7][7] });
    console.assert(chessBoard.board[7][0]!.color == EColor.White, { first: chessBoard.board[7][0] });
    console.assert(chessBoard.board[7][7]!.color == EColor.White, { first: chessBoard.board[7][7] });

    // Pawn
    // console.assert(chessBoard.board[1].every(p => p instanceof Pawn), { blackPawnLine: chessBoard.board[1] });
    // console.assert(chessBoard.board[6].every(p => p instanceof Pawn), { firstLine: chessBoard.board[6] });

    // console.assert(chessBoard.board[1].every(p => p!.color == EColor.Black), { blackPawnLine: chessBoard.board[1] });
    // console.assert(chessBoard.board[6].every(p => p!.color == EColor.White), { firstLine: chessBoard.board[6] });
  }
}

main();