export class PlayerInterface {
    name: string;
    level: number;
    strength: number;
    id: number;
    gameScore: number;
    setScore: number;
    matchPoint: number;
    advantage: boolean | null;

    constructor(){
        this.gameScore = 0;
        this.setScore = 0;
        this.matchPoint = 0;
    }
}