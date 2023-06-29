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
    let setNumber = 3;
    this.initmatch(player1, player2);
    this.play(this.match, setNumber);
  }

  private initmatch(player1: PlayerInterface, player2: PlayerInterface) {
    this.match = new MatchInterface();
    this.match.players.push(player1);
    this.match.players.push(player2);
    this.matchLogs = [];
    this.ballCount = 0;
    this.currentGame = undefined;
    this.currentSet = undefined
    this.setIndex = 0;
    this.gameIndex = 0;
  }

  private play(match: MatchInterface, setNumber: number = 3): void {
    //initialisation de la partie
    let player1 = match.players[0];
    let player2 = match.players[1];

    //on boucle pour avoir le nombre d'échange de coup souhaité
    for (let i = 0; i < 50; i++) {
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
    console.log(player1);
  }

  private playSet(
    player1: PlayerInterface,
    player2: PlayerInterface,
  ) {
    //On initialise le set
    //Si on a pas ou que le précédent est terminé de set on l'initialise

    if (this.currentSet === undefined){
      this.newSet(player1, player2);
      this.setIndex = this.match.sets.length - 1;
      this.currentSet = this.match.sets[this.setIndex];
    }        
    this.playGame(this.currentSet.players[0], this.currentSet.players[1])
  }

  private playGame(
    player1: PlayerInterface,
    player2: PlayerInterface,
    ) {

      //On initialise le jeu.
      //si on a pas de jeu ou que le précédent est terminé on l'initialise on l'initialise
      if(this.currentGame === undefined) {
        this.newGame(player1, player2, this.currentSet)
        this.currentGame = this.currentSet.games[this.gameIndex];
      }

      this.onePoint(this.currentGame.players[0], this.currentGame.players[1]);
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
      if (this.hasWonGame(opponent, shooter)) {
        opponent.gameScore++;
      }
      if (this.hasWonSet(opponent, shooter)) {
        opponent.setPoint++;
      }
    }
  }

  private hasWonGame(
    winner: PlayerInterface,
    looser: PlayerInterface,
  ): boolean {
    if (winner.gameScore < 4) {
      return false;
    } else if (this.gameIndex === 11 && winner.gameScore < 7) {
      return false;
    }

    if (winner.gameScore > looser.gameScore + 1) {
      return true;
    }

    return false;
  }

  private hasWonSet(
    winner: PlayerInterface,
    looser: PlayerInterface,
  ): boolean {
    if (winner.setPoint < 6) {
      return false;
    }

    if (winner.setPoint > looser.setPoint + 1) {      
      //TODO supprimer matchDebug
      this.matchDebug.push(
        'match ' +
          (this.setIndex + 1) +
          ' ' +
          winner.name +
          ' a gagner le point ' +
          winner.setPoint +
          ' points a ' +
          looser.setPoint
      );
      return true;
    }

    return false;
  }

  private newSet(player1: PlayerInterface, player2: PlayerInterface) {
    let set = new SetInterface();
    set.players.push(player1);
    set.players.push(player2);
    this.match.sets.push(set);
  }

  private newGame(player1: PlayerInterface, player2: PlayerInterface, currentSet: SetInterface) {
    let game = new GameInterface();
    game.players.push(player1);
    game.players.push(player2);
    currentSet.games.push(game);
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
