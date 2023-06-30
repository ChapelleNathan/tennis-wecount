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

  //Récupération des données du Formulaire
  public playerDatasEvent($event): void {
    let player1 = $event[0];
    let player2 = $event[1];
    this.play(player1, player2);
  }

  private initmatch(
    player1: PlayerInterface,
    player2: PlayerInterface
  ): MatchInterface {
    let newMatch = new MatchInterface();
    newMatch.players.push(player1);
    newMatch.players.push(player2);
    this.matchLogs = [];
    this.ballCount = 0;
    this.winner = undefined;
    return newMatch;
  }

  private play(player1: PlayerInterface, player2: PlayerInterface): void {
    //initialisation de la partie
    this.match = this.initmatch(player1, player2);
    this.currentSet = this.newSet();
    this.currentGame = this.newGame();
    
    //on boucle pour avoir le nombre d'échange de coup souhaité
    for (let i = 0; i < 150; i++) {
      //On joue un point
      this.onePoint(player1, player2);

      //On vérifie si la partie contiens un gagnant si oui on sort de la boucle
      if (this.winner) {
        this.matchResults = {
          match: this.match,
          winner: this.winner,
          lastSet: this.currentSet,
        };
        break;
      }
      this.ballCount++;
    }

    //A la fin de la boucle il n'y a pas de gagnant, donc on envoie les données de la partie non fini
    if (
      this.match.players[0].matchPoint < 3 &&
      this.match.players[1].matchPoint < 3
    ) {
      this.matchResults = {
        match: this.match,
        winner: this.winner,
        lastSet: this.currentSet,
      };
    }
  }

  private onePoint(shooter: PlayerInterface, opponent: PlayerInterface) {
    //on lance le dé pour savoir si il réussi son coup
    let roll = this.diceRoll();
    if (shooter.strength > roll) {
      //si il réussi son coup, il l'envoi à opponent qui deviens le shooter
      this.onePoint(opponent, shooter);
    } else {
      //si il rate on incrémente le score de opponent de 1
      opponent.gameScore++;
      this.matchLogs.push(
        'Point n°' + (this.ballCount + 1) + ' : remporté par ' + opponent.name
      );
      //On vérifie si opponent a gagné le jeu
      this.hasWonGame(opponent, shooter);
    }
  }

  private hasWonGame(winner: PlayerInterface, looser: PlayerInterface): void {
    //On vérifie si le nombre de jeu est supérieur à 12 pour savoir si c'est un jeu décisif
    if (this.currentSet.games.length - 1 < 11) {
      //Si jeu non décisif alors on joue en 4 points
      if (winner.gameScore < 4) {
        return;
      } else {
        //Si le joueur a 2 point de plus que son adversaire il gagne le jeu
        if (winner.gameScore > looser.gameScore + 1) {
          this.winningSet(winner, looser);
        } else {
          //sinon le gagnant passe en avantage
          winner.advantage = true;
          looser.advantage = false;
        }
      }
      //si jeu décisif alors on jour en 7
    } else {
      if (winner.gameScore < 7) {
        return;
      } else {
        //Le premier joueur a 7 point gagne le jeu décisif
        this.winningSet(winner, looser);
      }
    }
  }

  private winningSet(winner: PlayerInterface, looser: PlayerInterface) {
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
        score: this.match.players[1].gameScore,
      },
    ];

    //On réinitialise gameScore pour passer au jeu suivant
    this.match.players.forEach((player) => {
      player.gameScore = 0;
    });

    //On initialise un nouveau jeu et on le met a currentGame et on vérifie si le joueur n'a pas gagner le set
    this.currentGame = this.newGame();
    winner.advantage = null;
    looser.advantage = null;
    this.hasWonSet(winner, looser);
  }

  private hasWonSet(winner: PlayerInterface, looser: PlayerInterface): void {
    //On test si le score du set < 6 pas de possibilité de gagner le set
    if (winner.setScore < 6) {
      return;
    }

    //Si le gagnant a 2 jeu de plus que son adversaire alors il gagne le set
    if (winner.setScore > looser.setScore + 1) {
      //Incrémentation de matchPoint et stockage du résultat du set
      winner.matchPoint++;
      this.currentSet.results = [
        {
          playerId: this.match.players[0].id,
          setScore: this.match.players[0].setScore,
        },
        {
          playerId: this.match.players[1].id,
          setScore: this.match.players[1].setScore,
        },
      ];

      //Réinitialisation du score de set de chaque joueur pour passer à un nouveau set
      this.match.players.forEach((player) => {
        player.setScore = 0;
      });

      //Si le joueur a moins de 3 set on peut créer un nouveau set sinon le joueur a gagner la partie
      if (winner.matchPoint < 3) {
        this.currentSet = this.newSet();
      } else {
        this.winner = winner;
      }
    }
  }

  //Création d'un nouveau set
  private newSet(): SetInterface {
    let newSet = new SetInterface();
    this.match.sets.push(newSet);
    return newSet;
  }

  //Création d'un nouveau jeu
  private newGame(): GameInterface {
    let newGame = new GameInterface();
    this.currentSet.games.push(newGame);
    return newGame;
  }

  //Chiffre aléatoire entre 1 et 100
  private diceRoll(): number {
    return Math.round(Math.random() * 100) + 1;
  }
}
