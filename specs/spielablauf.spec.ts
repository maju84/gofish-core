import SpielkartenFactory from "../src/factories/SpielkartenFactory";
import Karte from "../src/value-types/Karte";
import Spiel, { Mitspieler } from "../src/Spiel";
import Spieler from "../src/entities/Spieler";
import { SpielerTyp } from "../src/value-types/SpielerTyp";


describe('Spielablauf vom GoFish Spiel', () => {

    let _spielkarten: Karte[];
    let _spieler: Mitspieler;

    beforeEach(() => {
        const spielkartenFactory = new SpielkartenFactory();

        _spielkarten = spielkartenFactory.erzeugen();
        _spieler = [
            new Spieler('Gregor B.', SpielerTyp.Mensch),
            new Spieler('HAL', SpielerTyp.Computer) ];
    })

    it('52 Spielkarten vorbereiten', () => {
        const spielkartenFactory = new SpielkartenFactory();
        const karten: Karte[] = spielkartenFactory.erzeugen();
        expect(karten.length).toBe(52);

    });

    it('Spiel hat 52 Spielkarten und 2 Spieler erhalten', () => {
        const spiel = new Spiel();

        // FIXME I do not like it at all!
        // this overwrites original implementation with mock impl 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        jest.spyOn<any,any>(spiel,'verteileFuenfKartenAnSpieler').mockImplementation(/* no impl */);

        spiel.starten(_spielkarten, _spieler);

        expect(spiel.deck.length).toBe(52);
        expect(spiel.spieler.length).toBe(2);      
        
    });


    it('Jedem Spieler 5 zufällige Karten vom Deck', () => {
        const spiel = new Spiel();

        spiel.starten(_spielkarten, _spieler);

        expect(spiel.deck.length).toBe(42);
        expect(spiel.spieler[0].karten.length).toBe(5);
        expect(spiel.spieler[1].karten.length).toBe(5);

    });


    it('Nächster Spieler an der Reihe', (done) => {
        const spiel = new Spiel();

        spiel.spielerGewechselt.subscribe( (spielerGewechselt) => {

            expect(spiel.aktuellerSpielerId).toBe(_spieler[0].id);

            expect(spielerGewechselt.neuerSpielerId).toBe(_spieler[0].id);

            done();
        });

        spiel.starten(_spielkarten, _spieler);        
    });


});