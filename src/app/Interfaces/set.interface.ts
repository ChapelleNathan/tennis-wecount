import { GameInterface } from "./game.interface";
import { PlayerInterface } from "./player.interface";

export class SetInterface {
    players: Array<PlayerInterface>;
    games: Array<GameInterface>;

    constructor() {
        this.players = [];
        this.games = [];
    }
}