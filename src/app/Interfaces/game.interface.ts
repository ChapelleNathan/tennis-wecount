import { PlayerInterface } from "./player.interface";

export class GameInterface {
    players: Array<PlayerInterface>;
    results: Array<{player: PlayerInterface, score: number}>
    constructor(){
        this.players = [];
        this.results = [];
    }
}