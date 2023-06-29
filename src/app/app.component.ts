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
  gameLogs: Array<string>;
  game: GameInterface;

  ngOnInit(): void {
    this.gameLogs = [];
  }

  public playerDatasEvent($event): void {
    let player1 = $event[0];
    let player2 = $event[1];
    this.resetGame();
    this.play(player1, player2);
  }

  private play(player1: PlayerInterface, player2: PlayerInterface):void {
    this.game = new GameInterface();
    this.game = {
      players: {
        player1 : player1,
        player2 : player2,
      },
      sets : [],
    };
  }


  private newSet() {
    let set = new SetInterface();
    set = {
      players: {
        player1 : {
          player: this.game.players.player1,
          score: 0,
        },
        player2: {
          player: this.game.players.player2,
          score: 0,
        }
      }
    };
    this.game.sets.push(set);
    this.resetSet()
  }

  private hasWonSet(winner: PlayerInterface, looser: PlayerInterface): boolean {
    if(winner.score < 4 ){
      return false;
    } else if (this.game.sets.length === 4 && winner.score < 7) {
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
    this.gameLogs = [];
  }
}
