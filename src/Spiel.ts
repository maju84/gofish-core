import { Subject } from 'rxjs';
import { NIL as NIL_UUID, v4 as uuidv4 } from 'uuid';
import SpielerGewechselt from './domain-events/SpielerGewechselt';
import SpielerHatKartenErhalten from './domain-events/SpielerHatKartenErhalten';
import Spieler from "./entities/Spieler";
import Karte from "./value-types/Karte";
import { Wert } from './value-types/Wert';

export default class Spiel {

    get id() { return this._id; }
    private readonly _id: string = uuidv4();

    get deck() { return this._deck; }
    private _deck: ReadonlyArray<Karte> = [];

    get spieler() { return this._spieler; }
    private _spieler: ReadonlyArray<Spieler> = [];

    get aktuellerSpielerId() { return this._aktuellerSpielerId; }
    private _aktuellerSpielerId: string = NIL_UUID;

    /* clients may subscribe ONLY ! */
    get spielerGewechselt() { 
        return this._spielerGewechseltSubject.asObservable(); 
    }
    private readonly _spielerGewechseltSubject = new Subject<SpielerGewechselt>();

    get spielerHatKartenErhalten() {
        return this._spielerHatKartenErhaltenSubject.asObservable(); 
    }
    private readonly _spielerHatKartenErhaltenSubject = new Subject<SpielerHatKartenErhalten>();

    starten(spielkarten: Karte[], mitspieler: Mitspieler) {
        this._deck = [...spielkarten];
        this._spieler = [...mitspieler];

        this.verteileFuenfKartenAnSpieler();        
        this.naechsterSpieler();
    }

    spielerFragtGegenspielerNachKarten(gefragterSpielerId: string, wert: Wert) {
        const fragenderSpieler = this.findeSpieler(this.aktuellerSpielerId);
        const gefragterSpieler = this.findeSpieler(gefragterSpielerId);

        const erhalteneKarten = gefragterSpieler.gebeKarten(wert);

        if (erhalteneKarten?.length > 0) {
            fragenderSpieler.nimmKarten(erhalteneKarten);
            this._spielerHatKartenErhaltenSubject.next(
                new SpielerHatKartenErhalten(
                    fragenderSpieler.id, gefragterSpieler.id, [ ...erhalteneKarten])
            );
        }
    }
    
    private findeSpieler(spielerId: string) {
        const spieler = this.spieler.find(spieler => spieler.id === spielerId);
        if (!spieler) {
            throw new Error('Kein Spieler mit der ID ${spielerId}');
        }
        return spieler;
    }

    private verteileFuenfKartenAnSpieler() { 
        this.spieler.forEach( spieler => {
            const karten = new Array<Karte>()
            for (let idx = 0; idx < 5; idx++) {
                karten.push(this.zieheEineKarteVomDeck());
            }
            spieler.nimmKarten( [ ... karten] );
        })
    }

    private zieheEineKarteVomDeck() {
        const randomIndex = Math.floor( Math.random() * this._deck.length);
        const deck = [...this._deck];
        const gezogeneKarte = deck.splice(randomIndex, 1)[0];
        this._deck = [...deck];

        return gezogeneKarte;
    }

    private naechsterSpieler() { 
        if (this.aktuellerSpielerId === NIL_UUID) {
            this._aktuellerSpielerId = this.spieler[0].id;
        }
        // TODO iterate spieler 

        this._spielerGewechseltSubject.next(new SpielerGewechselt(this.aktuellerSpielerId));
    }

   
}

export type Mitspieler = 
    [ Spieler, Spieler] |
    [ Spieler, Spieler, Spieler] |
    [ Spieler, Spieler, Spieler, Spieler] |
    [ Spieler, Spieler, Spieler, Spieler, Spieler] |
    [ Spieler, Spieler, Spieler, Spieler, Spieler, Spieler];