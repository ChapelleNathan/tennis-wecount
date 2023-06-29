import { PlayerInterface } from "./player.interface";

export class GameInterface {
    players: Array<PlayerInterface>;

    constructor(){
        this.players = [];
    }
}