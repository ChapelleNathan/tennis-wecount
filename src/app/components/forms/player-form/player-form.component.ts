import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-player-form',
  templateUrl: './player-form.component.html',
  styleUrls: ['./player-form.component.scss']
})
export class PlayerFormComponent implements OnInit{

  @Output() playerFormEvent = new EventEmitter();
  playerForm: FormGroup;

  constructor(){}

  ngOnInit(): void {
    this.playerForm = new FormGroup({
      player1Name: new FormControl('Joueur1'),
      player2Name: new FormControl('Joueur2'),
      player1Lvl: new FormControl(5),
      player2Lvl: new FormControl(5),
    })
  }

  onSubmit(playersData: Array<any>): void{
    this.playerFormEvent.emit(playersData)
    console.log(playersData);
  }
}
