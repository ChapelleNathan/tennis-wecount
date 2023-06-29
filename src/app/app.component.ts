import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PlayerInterface } from './Interfaces/player.interface';
import { GameInterface } from './Interfaces/game.interface';
import { SetInterface } from './Interfaces/set.interface';
import { find } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  gameLogs: Array<string>;
  game: GameInterface;

  ngOnInit(): void {
    this.gameLogs = [];
  }

  public playerDatasEvent($event): void {
    let player1 = $event[0];
    let player2 = $event[1];
    if (this.game) {
      this.resetGame();
    }
    this.play(player1, player2);
  }

  private initGame(player1: PlayerInterface, player2: PlayerInterface) {
    this.game = new GameInterface();
    this.game = {
      players: [
        {
          player: player1,
          setPoint: 0,
        },
        {
          player: player2,
          setPoint: 0,
        },
      ],
      sets: [],
    };
  }

  private play(player1: PlayerInterface, player2: PlayerInterface): void {
    let lastSet: SetInterface;
    //initialisation de la partie
    this.initGame(player1, player2);
    this.newSet();
    lastSet = this.game.sets[this.game.sets.length - 1];

    //on boucle pour avoir le nombre d'échange de coup souhaité
    for (let i = 0; i < 150; i++) {

      //On vérifie si le nombre de set gagné correspond au nombre de set total si c'est le cas il faut créer un nouveau set
      if(this.game.players[0].setPoint + this.game.players[1].setPoint == this.game.sets.length) {
        if(this.game.sets.length > 5) {
          this.game.sets.pop();
          return;
        }
        lastSet = this.game.sets[this.game.sets.length - 1];
        this.newSet();
      } 

      this.newPoint(lastSet.players[0], lastSet.players[1],i + 1);
    }
  }

  private newPoint(
    shooter: { player: PlayerInterface; score: number },
    opponent: { player: PlayerInterface; score: number },
    pointNumber: number,
  ) {
    //on lance le dé pour savoir si il réussi son coup
    let roll = this.diceRoll();

    if (shooter.player.strength > roll) {
      //si il réussi son coup, il l'envoi à opponent qui deviens le shooter
      this.newPoint(opponent, shooter, pointNumber);
    } else {
      //si il rate on incrémente le score de opponent de 1
      opponent.score++;
      this.gameLogs.push(
        'Point n°' + pointNumber + ' : ' + opponent.player.name + ' a marqué contre ' + shooter.player.name
      );

      //Si opponent gagne le set on incrémente setPoint de 1
      if (this.hasWonSet(opponent, shooter)) {
        let winner = this.game.players.find(el => el.player = opponent.player);
        winner.setPoint++;
      }
    }
  }

  private newSet() {
    let set = new SetInterface();
    set = {
      players: [
        {
          player: this.game.players[0].player,
          score: 0,
        },
        {
          player: this.game.players[1].player,
          score: 0,
        },
      ],
    };
    this.game.sets.push(set);
  }

  private hasWonSet(
    winner: { player: PlayerInterface; score: number },
    looser: { player: PlayerInterface; score: number }
  ): boolean {
    if (winner.score < 4) {
      return false;
    } else if (this.game.sets.length === 5 && winner.score < 7) {
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

  private resetSet(): void {
    this.game.sets.forEach((set) => {
      set.players[0].score = 0;
      set.players[1].score = 0;
    });
  }

  private resetGame(): void {
    this.resetSet();
    this.gameLogs = [];
  }
}
