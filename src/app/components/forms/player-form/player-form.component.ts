import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms';
import { PlayerInterface } from 'src/app/Interfaces/player.interface';

@Component({
  selector: 'app-player-form',
  templateUrl: './player-form.component.html',
  styleUrls: ['./player-form.component.scss']
})
export class PlayerFormComponent implements OnInit{

  @Output() playerFormEvent = new EventEmitter();
  player1Form: FormGroup;
  player2Form: FormGroup;

  constructor(){}

  ngOnInit(): void {
    this.player1Form = new FormGroup({
      name: new FormControl('Joueur1'),
      level: new FormControl(5),
    })

    this.player2Form = new FormGroup({
      name: new FormControl('Joueur2'),
      level: new FormControl(5)
    })
  }

  onSubmit(player1: PlayerInterface, player2: PlayerInterface): void{
    this.playerFormEvent.emit([player1, player2])
  }
}
