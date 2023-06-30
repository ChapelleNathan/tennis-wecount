import { GameInterface } from "./game.interface";
import { PlayerInterface } from "./player.interface";

export class SetInterface {
    games: Array<GameInterface>;
    results: Array<{playerId: string, setScore: number}>
    constructor() {
        this.games = [];
        this.results = [];
    }
}