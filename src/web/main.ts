import { createApp } from 'vue';
import App from './App.vue';
import GameManager from "../core/chess/GameManager";
import Board from "../core/board/Board";

GameManager.createInstance(new Board());

createApp(App).mount('#app');
