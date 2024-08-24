<template>
  <div>
    <h2>CurrentPlayer: {{ EColor[ref_currentPlayersColor] }}</h2>
  </div>

  <div>
    <h2>Status: {{ ref_gameStatus == EGameStatus.None ? "-" : EGameStatus[ref_gameStatus] }}</h2>
  </div>

  <div class="board">
    <div v-for="(row, y) in ref_grid" :key="y" class="row">
      <div
          v-for="(piece, x) in row"
          :key="x"
          class="chess-square"
          :class="{
            'white-square': (y + x) % 2 == 0,
            'black-square': (y + x) % 2 != 0,
            'highlight': isMoveablePosition(x, y)
          }"
          @dragstart="handleDragStart(x, y)"
          @dragover="handleDragOver"
          @drop="handleDrop(x, y)"
          :draggable="piece?.color == ref_currentPlayersColor"
      >
        <div
            :class="{
              'disabled': piece != null && ref_currentPlayersColor != piece.color,
              'able': piece != null && ref_currentPlayersColor == piece.color
            }"
        >
          {{ piece?.symbol }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue';
import GameManager from "../../core/chess/GameManager";
import {Grid} from "../../core/board/Board.type";
import Position from "../../core/chess/Position";
import Piece from "../../core/piece/Piece";
import EColor from "../../core/enum/EColor";
import EGameStatus from "../../core/enum/EGameStatus";

const gameManager = GameManager.instance;
const board = gameManager.board;

// ref
const ref_grid = ref<Grid>(board.grid);
const ref_selectedPiece = ref<Piece | null>(null);
const ref_movablePositions = ref<Position[]>([]);
const ref_currentPlayersColor = ref<EColor>(gameManager.currentPlayer);
const ref_gameStatus = ref<EGameStatus>(gameManager.status);

//
onMounted(() => {
  GameManager.instance.subscribe((newGrid: Grid, nextPlayer: EColor, nextGameStatus: EGameStatus) => {
    ref_grid.value = newGrid;
    ref_currentPlayersColor.value = nextPlayer;
    ref_gameStatus.value = nextGameStatus;
  });
});
onUnmounted(() => {

})

// setter
function setSelectedPiece(piece: Piece | null): void {
  gameManager.selectedPiece = piece;
  ref_selectedPiece.value = piece;

}
function setMovablePositions(ref_selectedPiece: Piece | null): void {
  if (ref_selectedPiece == null) {
    ref_movablePositions.value = [];
    return;
  }

  ref_movablePositions.value = ref_selectedPiece.getMovableAndAttackablePositions(board);
}
function clear(): void {
  ref_selectedPiece.value = null;
  ref_movablePositions.value = [];
}

// event handler
function handleDragStart(x: number, y: number): void {
  const piece = board.getPieceAt(new Position(x, y));

  if (piece == null || ref_currentPlayersColor.value != piece.color) {
    setSelectedPiece(null);
    return;
  }

  // debugger;
  setSelectedPiece(piece);
  setMovablePositions(piece);
}
function handleDragOver(e: Event): void {
  e.preventDefault();
}
function handleDrop(x: number, y: number): void {
  if (isMoveablePosition(x, y)) {
    gameManager.selectedPosition =  new Position(x, y);
    gameManager.update();
  }

  clear();
}

// helper
function isMoveablePosition(x: number, y: number): boolean {
  return ref_movablePositions.value.some((movablePosition) => movablePosition.isSame(new Position(x, y)));
}
</script>


<style scoped>
.board {
  display: flex;
  flex-wrap: wrap;

  width: 800px;
  height: 800px;
}

.row {
  display: flex;
}

.chess-square {
  width: 100px;
  height: 100px;



  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 3rem;
}

.white-square {
  background-color: #FFCF9F;
}

.black-square {
  background-color: #D28C45;
}

.highlight {
  box-sizing: border-box;
  background-color: red;

  border: 1px dashed white;
}

.disabled:hover {
  cursor: not-allowed;
}

.able:hover {
  cursor: grab;
}
</style>
