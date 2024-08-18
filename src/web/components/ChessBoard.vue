<template>
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
          :draggable="piece?.color == ref_currentPlayer"
      >
        <div>
          {{ piece?.symbol }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, computed, onUnmounted} from 'vue';
import GameManager from "../../core/chess/GameManager";
import {Grid} from "../../core/board/type";
import Position from "../../core/Position";
import Piece from "../../core/piece/Piece";
import EColor from "../../core/enum/EColor";


const gameManager = GameManager.instance;
const board = gameManager.board;
const ref_grid = ref<Grid>(board.grid);
const ref_currentPlayer = ref<EColor>(gameManager.currentPlayer);
const ref_selectedPiece = ref<Piece | null>(null);
const comp_movablePositions = computed<Position[]>(() => {
  if (ref_selectedPiece.value == null) {
    return [];
  }

  return ref_selectedPiece.value.getMovablePositions(board);
})

function updateFrame(newGrid: Grid, nextPlayer: EColor): void {
  // ref_grid.value = newGrid;
  ref_grid.value = newGrid;
  ref_currentPlayer.value = nextPlayer;
}
onMounted(() => {
  GameManager.instance.subscribe(updateFrame);
});

onUnmounted(() => {

})

function isMoveablePosition(x: number, y: number): boolean {
  return comp_movablePositions.value.some((movablePosition) => movablePosition.isSame(new Position(x, y)));
}

function handleDragStart(x: number, y: number): void {
  const position = new Position(x, y);
  const piece = board.getPieceAt(position);
  if (piece == null || piece.color != ref_currentPlayer.value) {
    return;
  }

  ref_selectedPiece.value = piece;
}

function handleDragOver(e: Event): void {
  e.preventDefault();
}

function handleDrop(x: number, y: number): void {
  if (!isMoveablePosition(x, y)) {
    clear();
    return;
  }

  console.assert(ref_selectedPiece.value != null, { x, y });
  ref_selectedPiece.value!.onMove(new Position(x, y));

  clear();
}

function clear(): void {
  ref_selectedPiece.value = null;
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
</style>
