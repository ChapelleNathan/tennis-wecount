import { GameInterface } from "./game.interface";
import { PlayerInterface } from "./player.interface";

export class SetInterface {
    players: Array<PlayerInterface>;
    games: Array<GameInterface>;
    results: Array<{player: PlayerInterface, setScore: number}>
    constructor() {
        this.players = [];
        this.games = [];
        this.results = [];
    }
}