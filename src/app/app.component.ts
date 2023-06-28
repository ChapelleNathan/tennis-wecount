import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PlayerInterface } from './Interfaces/player.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  player1: PlayerInterface;
  player2: PlayerInterface;
  gameResults: Array<string>;

  ngOnInit(): void {
    this.player1 = null;
    this.player2 = null
    this.gameResults = [];
  }

  public playerDatasEvent($event): void {
    this.player1 = $event[0];
    this.player2 = $event[1]
    if(this.gameResults) {this.gameResults = []}
    this.gameResults = this.game();
  }

  private game(): Array<string> {
    let dice: number;
    let results = [];
    for (let i = 0; i < 150; i++) {
      while (true) {
        dice = this.diceRoll();
        if (this.player1.strength < dice) {
          results.push('Point ' + (i + 1) + ' : remporté par ' + this.player1.name);
          break;
        }
        dice = this.diceRoll();
        if (this.player2.strength < dice) {
          results.push('Point ' + (i + 1) + ' : remporté par ' + this.player2.name);
          break;
        }
      }
    }    
    return results;
  }

  private setDetector():void {

  }

  private diceRoll(): number {
    return Math.round(Math.random() * 100 + 1);
  }
}
