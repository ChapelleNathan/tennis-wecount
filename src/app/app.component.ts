import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PlayerInterface } from './Interfaces/player.interface';
import { GameInterface } from './Interfaces/game.interface';
import { SetInterface } from './Interfaces/set.interface';
import { find } from 'rxjs';
import { MatchInterface } from './Interfaces/match.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  matchLogs: Array<string>;
  matchDebug: Array<string> = [];
  match: MatchInterface;
  matchResults: {match: MatchInterface, winner: PlayerInterface | null, lastSet: SetInterface}

  ngOnInit(): void {
    this.matchLogs = [];
  }

  public playerDatasEvent($event): void {
    let player1 = $event[0];
    let player2 = $event[1];
    this.matchDebug = [];
    let setNumber = 5;
    //this.play(player1, player2, setNumber);
    this.initmatch(player1, player2)
    console.log(this.match);
  }

  private initmatch(player1: PlayerInterface, player2: PlayerInterface) {
    this.match = new MatchInterface();
    this.match.players.push({player: player1, matchPoint: 0});
    this.match.players.push({player: player2, matchPoint: 0});
  }

  private play(
    match: MatchInterface
  ): void {
    let player1 = match.players[0].player;
    let player2 = match.players[1].player;
    let setNumber = 3;
    let setIndex = 0;
    //initialisation de la partie
    for (let i = 0; i < setNumber; i++) {
      this.newSet(player1, player2);
    }
    let currentSet: SetInterface = this.match.sets[setIndex];
    //on boucle pour avoir le nombre d'échange de coup souhaité
    for (let i = 0; i < 25; i++) {
      //On vérifie si l'un des joueurs n'a pas remporté 3 sets
      if (
        this.match.players[0].matchPoint === 3 ||
        this.match.players[1].matchPoint === 3
      ) {
        this.match.sets = this.match.sets.slice(0, setIndex + 1);
        this.defineWinner(setIndex);
        return;
      }

      //On vérifie si le nombre de set gagné est supérieur a l'index du set actuel pour pouvoir passer au set suivant
      if (
        this.match.players[0].matchPoint + this.match.players[1].matchPoint >
        setIndex
      ) {
        setIndex++;
        if (setIndex > 2) {
          this.defineWinner(setIndex);
          return;
        }
        currentSet = this.match.sets[setIndex];
      }

      //TODO faire une fonction pour faire completer un Set
      this.playSet(
        currentSet.players[0],
        currentSet.players[1],
        i + 1,
        setIndex
      );
    }
    this.match.sets = this.match.sets.slice(0, setIndex + 1);
    this.defineWinner(setIndex);
  }

  private playSet(
    shooter: { player: PlayerInterface; setPoints: number },
    opponent: { player: PlayerInterface; setPoints: number },
    pointNumber: number,
    setIndex: number
  ) {
    //on lance le dé pour savoir si il réussi son coup
    let roll = this.diceRoll();

    if (shooter.player.strength > roll) {
      //si il réussi son coup, il l'envoi à opponent qui deviens le shooter
      this.playSet(opponent, shooter, pointNumber, setIndex);
    } else {
      //si il rate on incrémente le score de opponent de 1
      opponent.setPoints++;
      this.matchLogs.push(
        'Point n°' +
          pointNumber +
          ' : ' +
          opponent.player.name +
          ' a marqué contre ' +
          shooter.player.name
      );

      //Si opponent gagne le set on incrémente matchPoint de 1
      if (this.hasWonSet(opponent, shooter, setIndex)) {
        this.match.players.forEach((player) => {
          if (player.player == opponent.player) {
            player.matchPoint++;
          }
        });
      }
    }
  }

  private newSet(player1: PlayerInterface, player2: PlayerInterface) {
    let set = new SetInterface();
    set.players.push({player: player1, setPoints: 0})
    set.players.push({player: player2, setPoints: 0})
    this.match.sets.push(set);
  }

  private hasWonSet(
    winner: { player: PlayerInterface; setPoints: number },
    looser: { player: PlayerInterface; setPoints: number },
    setIndex
  ): boolean {
    if (winner.setPoints < 4) {
      return false;
    } else if (setIndex === 4 && winner.setPoints < 7) {
      return false;
    }

    if (winner.setPoints > looser.setPoints + 1) {
      //TODO supprimer matchDebug
      console.log('winner : ',winner.setPoints, 'looser : ', looser.setPoints);
      this.matchDebug.push('match ' + (setIndex + 1) + ' ' + winner.player.name + ' a gagner le point ' + winner.setPoints + ' points a ' + looser.setPoints);
      return true;
    }

    return false;
  }

  private diceRoll(): number {
    return Math.round(Math.random() * 100 + 1);
  }

  private defineWinner(setIndex: number): void {
    let winner: PlayerInterface;
    if (this.match.players[0].matchPoint === 3) {
      winner = this.match.players[0].player;
    } else if (this.match.players[1].matchPoint === 3) {
      winner = this.match.players[1].player;
    } else {
      winner = null;
    }
    this.matchResults = {match: this.match, winner: winner, lastSet: this.match.sets[setIndex]};
  }
}
