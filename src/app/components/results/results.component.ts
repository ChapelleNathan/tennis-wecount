import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GameInterface } from 'src/app/Interfaces/game.interface';
import { MatchInterface } from 'src/app/Interfaces/match.interface';
import { PlayerInterface } from 'src/app/Interfaces/player.interface';
import { SetInterface } from 'src/app/Interfaces/set.interface';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent {
  @Input() matchResults: {match: MatchInterface, winner: PlayerInterface | null, lastSet: SetInterface};
}
