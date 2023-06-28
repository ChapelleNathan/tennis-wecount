import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PlayerInterface } from './Interfaces/player.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  playerDatas: Array<PlayerInterface>;
  gameResults: Array<string>;
  player1Score: number;
  player2Score: number;

  ngOnInit(): void {
    this.playerDatas = null;
    this.gameResults = [];
  }

  public playerDatasEvent($event): void {
    this.playerDatas = $event;
    if(this.gameResults) {this.gameResults = []}
    this.gameResults = this.game(this.playerDatas);
  }

  private game(players: Array<PlayerInterface>): Array<string> {
    let player1 = players[0];
    let player2 = players[1];
    this.player1Score = 0;
    this.player2Score = 0;
    let dice: number;
    let results = [];
    for (let i = 0; i < 150; i++) {
      while (true) {
        dice = this.diceRoll();
        if (player1.strength < dice) {
          results.push('Point ' + (i + 1) + ' : remporté par ' + player1.name);
          this.player2Score++;
          break;
        }
        dice = this.diceRoll();
        if (player2.strength < dice) {
          results.push('Point ' + (i + 1) + ' : remporté par ' + player2.name);
          this.player1Score++;
          break;
        }
      }
    }    
    return results;
  }

  private diceRoll(): number {
    return Math.round(Math.random() * 100 + 1);
  }
}
