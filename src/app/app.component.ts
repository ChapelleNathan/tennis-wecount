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
  ballCount: number = 0;
  currentSet: SetInterface;
  currentGame: GameInterface;
  setIndex : number;
  gameIndex: number;
  matchResults: {
    match: MatchInterface;
    winner: PlayerInterface | null;
    lastSet: SetInterface;
  };

  ngOnInit(): void {
    this.matchLogs = [];
  }

  public playerDatasEvent($event): void {
    let player1 = $event[0];
    let player2 = $event[1];
    this.matchDebug = [];
    this.initmatch(player1, player2);
    this.play(this.match);
  }

  private initmatch(player1: PlayerInterface, player2: PlayerInterface) {
    this.match = new MatchInterface();
    this.match.players.push(player1);
    this.match.players.push(player2);
    this.matchLogs = [];
    this.ballCount = 0;
    this.currentGame = undefined;
    this.currentSet = undefined
  }

  private play(match: MatchInterface): void {
    //initialisation de la partie
    let player1 = match.players[0];
    let player2 = match.players[1];
    this.currentSet = this.newSet(player1, player2);
    this.currentGame = this.newGame(player1, player2);
    //on boucle pour avoir le nombre d'échange de coup souhaité
    for (let i = 0; i < 150; i++) {
      //On vérifie si l'un des joueurs n'a pas remporté 3 sets
      /* if (
        this.match.players[0].matchPoint === 3 ||
        this.match.players[1].matchPoint === 3
      ) {
        this.match.sets = this.match.sets.slice(0, setIndex + 1);
        this.defineWinner(setIndex);
        return;
      }*/

      //On vérifie si le nombre de set gagné est supérieur a l'index du set actuel pour pouvoir passer au set suivant
      /*if (
        this.match.players[0].matchPoint + this.match.players[1].matchPoint >
        setIndex
      ) {
        setIndex++;
        if (setIndex > 2) {
          this.defineWinner(setIndex);
          return;
        }
        currentSet = this.match.sets[setIndex];
      }*/

      //TODO faire une fonction pour faire completer un Set
      this.playSet(player1, player2);
      this.ballCount++;
    }
    console.log(match.sets[0].games, match.sets);
    
  }

  private playSet(
    player1: PlayerInterface,
    player2: PlayerInterface,
  ) {
         
    this.playGame(player1, player2)
  }

  private playGame(
    player1: PlayerInterface,
    player2: PlayerInterface,
    ) {


      this.onePoint(player1, player2);
    }
  

  private onePoint(
    shooter: PlayerInterface,
    opponent: PlayerInterface,
    ){
       //on lance le dé pour savoir si il réussi son coup
    let roll = this.diceRoll();
    if (shooter.strength > roll) {
      //si il réussi son coup, il l'envoi à opponent qui deviens le shooter
      this.onePoint(opponent, shooter);
    } else {
      //si il rate on incrémente le score de opponent de 1
      opponent.gameScore++;
      this.matchLogs.push(
        'Point n°' +
          (this.ballCount + 1) +
          ' : ' +
          opponent.name +
          ' a marqué contre ' +
          shooter.name
      );
      //Si opponent gagne le set on incrémente matchPoint de 1
      this.hasWonGame(opponent, shooter);
    }
  }

  private hasWonGame(
    winner: PlayerInterface,
    looser: PlayerInterface,
  ): void {
    if (winner.gameScore < 4) {
      return;
    } else if (this.gameIndex >= 11 && winner.gameScore < 7) {
      return;
    }

    if (winner.gameScore > looser.gameScore + 1) {
      //On incrémente setScore de 1 car winner a ganger le set
      winner.setScore++;
      //On enregistre le score du set pour le lire plus tard sur le front
      this.currentGame.results = [
        {
          player: this.match.players[0],
          score: this.match.players[0].gameScore,
        },
        {
          player: this.match.players[1],
          score: this.match.players[1].gameScore
        }
      ]
      //On réinitialise gameScore pour passer au jeu suivant
      this.match.players.forEach(player => {
        player.gameScore = 0;
      });

      //On initialise un nouveau jeu et on le met a currentGame et on vérifie si le joueur n'a pas gagner le set
      this.currentGame = this.newGame(this.match.players[0], this.match.players[1]);
      this.hasWonSet(winner, looser)
    }
    return;
  }

  private hasWonSet(
    winner: PlayerInterface,
    looser: PlayerInterface,
  ): void {
    if (winner.setScore < 6) {
      return;
    }

    if (winner.setScore > looser.setScore + 1) {  
      winner.matchPoint++;

      this.currentSet.results = [
        {
          player: this.match.players[0],
          setScore: this.match.players[0].setScore
        },
        {
          player: this.match.players[1],
          setScore: this.match.players[1].setScore,
        },
      ];
      this.match.players.forEach(player => {
        player.setScore = 0;
      });
      this.currentSet = this.newSet(this.match.players[0], this.match.players[1]);
      //TODO supprimer matchDebug
      this.matchDebug.push(
        'match ' +
          (this.setIndex + 1) +
          ' ' +
          winner.name +
          ' a gagner le set ' +
          winner.setScore +
          ' points a ' +
          looser.setScore
      );
    }

    return;
  }

  private newSet(player1: PlayerInterface, player2: PlayerInterface): SetInterface {
    let newSet = new SetInterface();
    newSet.players.push(player1);
    newSet.players.push(player2);
    this.match.sets.push(newSet);
    return newSet;
  }

  private newGame(player1: PlayerInterface, player2: PlayerInterface): GameInterface {
    let newGame = new GameInterface();
    newGame.players.push(player1);
    newGame.players.push(player2);
    this.currentSet.games.push(newGame);
    return newGame;
  }

  private diceRoll(): number {
    return Math.round(Math.random() * 100 + 1);
  }

  private defineWinner(setIndex: number): void {
    let winner: PlayerInterface;
    if (this.match.players[0].matchPoint === 3) {
      winner = this.match.players[0];
    } else if (this.match.players[1].matchPoint === 3) {
      winner = this.match.players[1];
    } else {
      winner = null;
    }
    this.matchResults = {
      match: this.match,
      winner: winner,
      lastSet: this.match.sets[setIndex],
    };
  }
}
