export class PlayerInterface {
    name: string;
    level: number;
    strength: number;

    constructor(name: string, level: number, strength: number) {
        this.name = name;
        this.level = level;
        this.strength = strength;
    }
}