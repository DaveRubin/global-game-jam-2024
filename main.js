import './style.css'
import { AppScene as App } from './AppScene';
import './audioCheck';

console.log(`main.ts starting ${App.name}`);
window.addEventListener('DOMContentLoaded', () => {
  let canvas = document.getElementById('renderCanvas');
  let app = new App(canvas);
  app.run();
});