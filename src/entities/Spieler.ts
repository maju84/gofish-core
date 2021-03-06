import { v4 as uuidv4 } from 'uuid';
import Karte from "../value-types/Karte";
import { SpielerTyp } from "../value-types/SpielerTyp";
import { Wert } from '../value-types/Wert';

export default class Spieler {

    get id() { return this._id; }
    private readonly _id: string = uuidv4();

    get karten() { return this._karten; };
    private _karten: ReadonlyArray<Karte> = [];

    get saetze() { return this._saetze; };
    private _saetze: ReadonlyArray<Karte> = [];
    
    constructor(
        public readonly name: string, 
        public readonly spielerTyp: SpielerTyp
        ) {         
    }

    /** @internal */
    nimmKarten(karten: Karte[]) {
        this._karten = [...this._karten, ...karten];
    }
    
    /** @internal */
    gebeKarten(kartenWert: Wert) {
        const karten = this.karten.filter(karte => karte.wert === kartenWert);

        this._karten = this.karten.filter(karte => karte.wert !== kartenWert);

        return [ ...karten];
    }

}

