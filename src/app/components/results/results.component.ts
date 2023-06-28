import { Component, Input } from '@angular/core';
import { GameInterface } from 'src/app/Interfaces/game.interface';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent {
  @Input() gameResults: GameInterface;
}
