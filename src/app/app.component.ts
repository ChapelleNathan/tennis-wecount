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
  gameDebug: Array<string> = [];
  game: GameInterface;
  gameResults: {game: GameInterface, winner: PlayerInterface | null, lastSet: SetInterface}

  ngOnInit(): void {
    this.gameLogs = [];
  }

  public playerDatasEvent($event): void {
    let player1 = $event[0];
    let player2 = $event[1];
    this.gameDebug = [];
    let setNumber = 5;
    if (this.game) {
      this.resetGame();
    }
    this.play(player1, player2, setNumber);
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

  private play(
    player1: PlayerInterface,
    player2: PlayerInterface,
    setNumber: number
  ): void {
    let setIndex = 0;
    //initialisation de la partie
    this.initGame(player1, player2);
    for (let i = 0; i < setNumber; i++) {
      this.newSet();
    }
    let currentSet: SetInterface = this.game.sets[setIndex];
    //on boucle pour avoir le nombre d'échange de coup souhaité
    for (let i = 0; i < 25; i++) {
      //On vérifie si l'un des joueurs n'a pas remporté 3 sets
      if (
        this.game.players[0].setPoint === 3 ||
        this.game.players[1].setPoint === 3
      ) {
        this.game.sets = this.game.sets.slice(0, setIndex + 1);
        this.defineWinner(setIndex);
        return;
      }

      //On vérifie si le nombre de set gagné est supérieur a l'index du set actuel pour pouvoir passer au set suivant
      if (
        this.game.players[0].setPoint + this.game.players[1].setPoint >
        setIndex
      ) {
        setIndex++;
        if (setIndex > 4) {
          this.defineWinner(setIndex);
          return;
        }
        currentSet = this.game.sets[setIndex];
      }

      this.newPoint(
        currentSet.players[0],
        currentSet.players[1],
        i + 1,
        setIndex
      );
    }
    this.game.sets = this.game.sets.slice(0, setIndex + 1);
    this.defineWinner(setIndex);
  }

  private newPoint(
    shooter: { player: PlayerInterface; score: number },
    opponent: { player: PlayerInterface; score: number },
    pointNumber: number,
    setIndex: number
  ) {
    //on lance le dé pour savoir si il réussi son coup
    let roll = this.diceRoll();

    if (shooter.player.strength > roll) {
      //si il réussi son coup, il l'envoi à opponent qui deviens le shooter
      this.newPoint(opponent, shooter, pointNumber, setIndex);
    } else {
      //si il rate on incrémente le score de opponent de 1
      opponent.score++;
      this.gameLogs.push(
        'Point n°' +
          pointNumber +
          ' : ' +
          opponent.player.name +
          ' a marqué contre ' +
          shooter.player.name
      );

      //Si opponent gagne le set on incrémente setPoint de 1
      if (this.hasWonSet(opponent, shooter, setIndex)) {
        this.game.players.forEach((player) => {
          if (player.player == opponent.player) {
            player.setPoint++;
          }
        });
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
    looser: { player: PlayerInterface; score: number },
    setIndex
  ): boolean {
    if (winner.score < 4) {
      return false;
    } else if (setIndex === 4 && winner.score < 7) {
      return false;
    }

    if (winner.score > looser.score + 1) {
      //TODO supprimer gameDebug
      console.log('winner : ',winner.score, 'looser : ', looser.score);
      this.gameDebug.push('Game ' + (setIndex + 1) + ' ' + winner.player.name + ' a gagner le point ' + winner.score + ' points a ' + looser.score);
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

  private defineWinner(setIndex: number): void {
    let winner: PlayerInterface;
    if (this.game.players[0].setPoint === 3) {
      winner = this.game.players[0].player;
    } else if (this.game.players[1].setPoint === 3) {
      winner = this.game.players[1].player;
    } else {
      winner = null;
    }
    this.gameResults = {game: this.game, winner: winner, lastSet: this.game.sets[setIndex]};
  }
}
