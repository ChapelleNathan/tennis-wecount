export class PlayerInterface {
    name: string;
    level: number;
    strength: number;
    id: number;
    gameScore: number;
    setPoint: number;
    matchPoint: number;

    constructor(){
        this.gameScore = 0;
        this.setPoint = 0;
        this.matchPoint = 0;
    }
}