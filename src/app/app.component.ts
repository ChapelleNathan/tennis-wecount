import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PlayerInterface } from './Interfaces/player.interface';
import { GameInterface } from './Interfaces/game.interface';
import { SetInterface } from './Interfaces/set.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  player1: PlayerInterface;
  player2: PlayerInterface;
  gameResults: Array<string>;
  game: GameInterface;
  sets: Array<SetInterface>;

  ngOnInit(): void {
    this.sets = null;
    this.gameResults = null;
  }

  public playerDatasEvent($event): void {
    this.player1 = $event[0];
    this.player2 = $event[1];
    this.resetGame();
    this.gameResults = this.play();
  }

  private play(): Array<string> {
    this.sets = [];
    this.game = {
      player1: this.player1,
      player2: this.player2,
      sets: this.sets,
    };        
    let dice: number;
    let results = [];
    for (let i = 0; i < 150; i++) {        
      while (true) {       
        if(this.game.sets.length > 5 ){
          return results;
        }
        dice = this.diceRoll();
        if (this.player1.strength < dice) {
          this.player2.score++;
          results.push(
            'Point ' + (i + 1) + ' : remporté par ' + this.player2.name
          );
          if (this.hasWon(this.player2, this.player1)) {

            this.newSet();
          }
          break;
        }
        dice = this.diceRoll();
        if (this.player2.strength < dice) {
          this.player1.score++;
          results.push(
            'Point ' + (i + 1) + ' : remporté par ' + this.player1.name
          );
          if (this.hasWon(this.player1, this.player2)) {
            
            this.newSet();
          }
          break;
        }
      }    
    }     
    return results;
  }

  private newSet() {
    let set = new SetInterface();
    set = {
      player1Score: this.player1.score,
      player2Score: this.player2.score,
    };
    this.game.sets.push(set);
    this.resetSet()
  }
  private hasWon(winner: PlayerInterface, looser: PlayerInterface): boolean {
    if(winner.score < 4 ){
      return false;
    }

    if (winner.score > looser.score + 1) {
      return true;
    }
    return false;
  }

  private diceRoll(): number {
    return Math.round(Math.random() * 100 + 1);
  }

  private resetSet(): void{    
    this.player1.score = 0;
    this.player2.score = 0;
  }

  private resetGame(): void {
    this.resetSet();
    this.gameResults = [];
  }
}
