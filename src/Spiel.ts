import { v4 as uuidv4 } from 'uuid';
import Spieler from "./entities/Spieler";
import Karte from "./value-types/Karte";

export default class Spiel {
    
    get id() { return this._id; }
    private readonly _id: string = uuidv4();

    get deck() { return this._deck; }
    private _deck: ReadonlyArray<Karte> = [];

    get spieler() { return this._spieler; }
    private _spieler: ReadonlyArray<Spieler> = [];

    starten(spielkarten: Karte[], mitspieler: Mitspieler) {
        this._deck = [...spielkarten];
        this._spieler = [...mitspieler];

        this.verteileFuenfKartenAnSpieler();        
    }

    private verteileFuenfKartenAnSpieler() { 
        this.spieler.forEach( spieler => {
            for (let idx = 0; idx < 5; idx++) {
                spieler.nimmKarte( this.zieheEineKarteVomDeck() );
            }
        })
    }

    private zieheEineKarteVomDeck(): Karte {
        const randomIndex = Math.floor( Math.random() * this._deck.length);
        const deck = [...this._deck];
        const karte: Karte = deck.splice(randomIndex, 1)[0];
        this._deck = [...deck];
        return karte;
    }
   
}

export type Mitspieler = 
    [ Spieler, Spieler] |
    [ Spieler, Spieler, Spieler] |
    [ Spieler, Spieler, Spieler, Spieler] |
    [ Spieler, Spieler, Spieler, Spieler, Spieler] |
    [ Spieler, Spieler, Spieler, Spieler, Spieler, Spieler];