import { PlayerInterface } from "./player.interface";

export class SetInterface {
    players: {
        player1 : {
            player : PlayerInterface,
            score: number,
        },
        player2: {
            player: PlayerInterface,
            score: number,
        },
    }
}