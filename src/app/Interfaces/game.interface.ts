import { PlayerInterface } from "./player.interface";

export class GameInterface {
    results: Array<{playerId: number, score: number}>
    constructor(){
        this.results = [];
    }
}