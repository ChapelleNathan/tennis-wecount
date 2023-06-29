import { PlayerInterface } from "./player.interface";
import { SetInterface } from "./set.interface";

export class MatchInterface {
    players: Array<{player: PlayerInterface, matchPoint: number}>;
    sets: Array<SetInterface>;

    constructor(){
        this.players = [];
        this.sets = [];
    }
}