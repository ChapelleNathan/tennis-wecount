import { GameInterface } from "./game.interface";
import { PlayerInterface } from "./player.interface";

export class SetInterface {
    players: Array<{player: PlayerInterface, setPoints: number}>;
    games: Array<GameInterface>;

    constructor() {
        this.players = [];
        this.games = [];
    }
}