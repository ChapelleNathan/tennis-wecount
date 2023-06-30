import { PlayerInterface } from "./player.interface";

export class GameInterface {
    results: Array<{playerId: string, score: number}>
    constructor(){
        this.results = [];
    }
}