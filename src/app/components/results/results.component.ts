import { Component, Input } from '@angular/core';
import { GameInterface } from 'src/app/Interfaces/game.interface';
import { PlayerInterface } from 'src/app/Interfaces/player.interface';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent {
  @Input() gameResults: {game: GameInterface, winner: PlayerInterface | null};
}
