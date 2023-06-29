import { PlayerInterface } from "./player.interface";

export class GameInterface {
    players: Array<{player: PlayerInterface, score: number }>;

    constructor(){
        this.players = [];
    }
}