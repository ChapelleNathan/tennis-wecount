import { PlayerInterface } from "./player.interface";
import { SetInterface } from "./set.interface";

export class GameInterface {
    players: [
        player1:{
            player: PlayerInterface,
            setPoint: number,
        },
        player2: {
            player: PlayerInterface,
            setPoint: number,
        },
    ]
    sets: Array<SetInterface>;
}