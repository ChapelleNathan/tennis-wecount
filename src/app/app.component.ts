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
  match: MatchInterface;
  ballCount: number = 0;
  currentSet: SetInterface;
  currentGame: GameInterface;
  winner: PlayerInterface;
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
    this.winner = undefined;
  }

  private play(match: MatchInterface): void {
    //initialisation de la partie
    let player1 = match.players[0];
    let player2 = match.players[1];
    this.currentSet = this.newSet();
    this.currentGame = this.newGame();
    //on boucle pour avoir le nombre d'échange de coup souhaité
    for (let i = 0; i < 150; i++) {

      this.onePoint(player1,player2);

      if(this.winner) {
        this.matchResults = {
          match: match,
          winner: this.winner,
          lastSet: this.currentSet,
        }
        break;
      }
      this.ballCount++;
    }
    if (match.players[0].matchPoint < 3 && match.players[1].matchPoint < 3) {
      this.matchResults = {
        match: match,
        winner: this.winner,
        lastSet: this.currentSet,
      }
    }
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
        'Point n°' + (this.ballCount + 1) + ' : remporté par ' + opponent.name);
      //On vérifie si opponent 
      this.hasWonGame(opponent, shooter);
    }
  }

  private hasWonGame(
    winner: PlayerInterface,
    looser: PlayerInterface,
  ): void {
    if (this.currentSet.games.length - 1 < 11)
    {
      if (winner.gameScore < 4) {
        return;
      }
    } else {
      if (winner.gameScore < 7) {
        return;
      }
    }

    if (winner.gameScore > looser.gameScore + 1) {
      //On incrémente setScore de 1 car winner a ganger le set
      winner.setScore++;

      //On enregistre le score du set pour le lire plus tard sur le front
      this.currentGame.results = [
        {
          playerId: this.match.players[0].id,
          score: this.match.players[0].gameScore,
        },
        {
          playerId: this.match.players[1].id,
          score: this.match.players[1].gameScore
        }
      ]
      
      //On réinitialise gameScore pour passer au jeu suivant
      this.match.players.forEach(player => {
        player.gameScore = 0;
      });

      //On initialise un nouveau jeu et on le met a currentGame et on vérifie si le joueur n'a pas gagner le set
      this.currentGame = this.newGame();
      winner.advantage = null;
      looser.advantage = null;
      this.hasWonSet(winner, looser);
    } else {
      winner.advantage = true;
      looser.advantage = false;
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
          playerId: this.match.players[0].id,
          setScore: this.match.players[0].setScore
        },
        {
          playerId: this.match.players[1].id,
          setScore: this.match.players[1].setScore,
        },
      ];
      this.match.players.forEach(player => {
        player.setScore = 0;
      });

      if(winner.matchPoint < 3) {
        this.currentSet = this.newSet();
      } else {
        if (this.hasWonMatch(winner)) {
          this.winner = winner;
        }
      }
    }
    return;
  }

  private hasWonMatch(
    winner: PlayerInterface,
  ): boolean {
    if (winner.matchPoint < 3) {
      return false;
    } else {
      return true;
    }
  }

  private newSet(): SetInterface {
    let newSet = new SetInterface();
    this.match.sets.push(newSet);
    return newSet;
  }

  private newGame(): GameInterface {
    let newGame = new GameInterface();
    this.currentSet.games.push(newGame);
    return newGame;
  }

  private diceRoll(): number {
    return Math.round(Math.random() * 100 + 1);
  }
}
