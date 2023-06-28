import { Component } from '@angular/core';

@Component({
  selector: 'app-game-window',
  templateUrl: './game-window.component.html',
  styleUrls: ['./game-window.component.scss']
})
export class GameWindowComponent {
 /*calcul pour %age de chance de gagner le point
 (lvl / 10) * 100 - (lvl / 2)
 */

 stat : boolean = false;

 public play(){
  // launch the game
 }
}
