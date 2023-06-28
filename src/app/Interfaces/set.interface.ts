import { PlayerInterface } from "./player.interface";

export class SetInterface {
    player1: PlayerInterface;
    player2: PlayerInterface;
    score : {
        player1Score: number;
        player2Score: number;
    }

    constructor(player1: PlayerInterface, player2: PlayerInterface){
        this.player1 = player1;
        this.player2 = player2;
    }
}