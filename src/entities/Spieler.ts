import { v4 as uuidv4 } from 'uuid';
import Karte from "../value-types/Karte";
import { SpielerTyp } from "../value-types/SpielerTyp";

export default class Spieler {

    get id() { return this._id; }
    private readonly _id: string = uuidv4();

    get Karten() { return this._karten; };
    private _karten: ReadonlyArray<Karte> = [];

    get Saetze() { return this._saetze; };
    private _saetze: ReadonlyArray<Karte> = [];
    


    constructor(
        public readonly name: string, 
        public readonly spielerTyp: SpielerTyp
        ) {
            

    }
}
