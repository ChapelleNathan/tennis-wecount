import { PlayerInterface } from "./player.interface";
import { SetInterface } from "./set.interface";

export class GameInterface {
    player1: PlayerInterface;
    player2: PlayerInterface;
    sets: Array<SetInterface>;
}