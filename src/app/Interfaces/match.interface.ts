import { PlayerInterface } from "./player.interface";
import { SetInterface } from "./set.interface";

export class MatchInterface {
    players: Array<PlayerInterface>;
    sets: Array<SetInterface>;
    results: Array<{player: PlayerInterface, matchPoint: number}>

    constructor(){
        this.players = [];
        this.sets = [];
        this.results = [];
    }
}