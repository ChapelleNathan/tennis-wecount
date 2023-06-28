import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-player-form',
  templateUrl: './player-form.component.html',
  styleUrls: ['./player-form.component.scss']
})
export class PlayerFormComponent implements OnInit{

  playerForm: FormGroup;

  constructor(){}

  ngOnInit(): void {
    this.playerForm = new FormGroup({
      player1: new FormControl(null),
      player2: new FormControl(null),
      player1Lvl: new FormControl(5),
      player2Lvl: new FormControl(5),
    })
  }
  onSubmit(){
    console.log(this.playerForm.value.player1);
    
  }
}
