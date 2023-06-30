import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PlayerInterface } from 'src/app/Interfaces/player.interface';

@Component({
  selector: 'app-player-form',
  templateUrl: './player-form.component.html',
  styleUrls: ['./player-form.component.scss'],
})
export class PlayerFormComponent implements OnInit {
  @Output() playerFormEvent = new EventEmitter();
  player1Form: FormGroup;
  player2Form: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.player1Form = new FormGroup({
      name: new FormControl('Joueur1', [
        Validators.required
      ]),
      level: new FormControl(5,[
        Validators.required,
        Validators.max(10),
        Validators.min(1),
      ]),
    });

    this.player2Form = new FormGroup({
      name: new FormControl('Joueur2', [
        Validators.required
      ]),
      level: new FormControl(5, [
        Validators.required,
        Validators.max(10),
        Validators.min(1),
      ]),
    });
  }

  onSubmit(player1: PlayerInterface, player2: PlayerInterface): void {

    if (this.player1Form.valid && this.player2Form.valid){
      let players = [player1,player2]
      players.forEach(player => {
        this.strengthCalculator(player)
        this.idGenerator(player)
        player.gameScore = 0;
        player.setScore = 0;
        player.matchPoint = 0;
      });    
      this.playerFormEvent.emit(players);
    } else {
      console.log('toto');
    }
  }

  private strengthCalculator(player: PlayerInterface): void {
    let strength =
      player.level * 10 - player.level / 2 - Math.floor(Math.random() * 11);
    strength < 10 ? (player.strength = 10) : (player.strength = strength);
  }

  private idGenerator(player: PlayerInterface):void {
    player.id = Math.floor(Math.random() * 10000 + 1)
  }
}
