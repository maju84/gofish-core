import SpielkartenFactory from "../src/factories/SpielkartenFactory";
import Karte from "../src/value-types/Karte";
import Spiel, { Mitspieler } from "../src/Spiel";
import Spieler from "../src/entities/Spieler";
import { SpielerTyp } from "../src/value-types/SpielerTyp";
import { Wert } from "../src/value-types/Wert";
import { Farbe } from "../src/value-types/Farbe";


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


    it('Spieler fragt Gegenspieler nach Karte. Er gibt diese dem Spieler.', (done) => {
        const computerSpieler = _spieler[1];
        computerSpieler.nimmKarten( [
            new Karte(Farbe.Karo, Wert.Fünf),
            new Karte(Farbe.Kreuz, Wert.Fünf)
        ]);
        
        const spiel = new Spiel();    

        spiel.spielerGewechselt.subscribe( () => {

            // "wichtig, dass das SPIEL es regelt", anstatt spieler.frageNachKarte... - TODO why?
            spiel.spielerFragtGegenspielerNachKarten( spiel.spieler[1].id, Wert.Fünf );
        });

        spiel.spielerHatKartenErhalten.subscribe( (kartenErhaltenVomSpieler) => {

            expect(kartenErhaltenVomSpieler.fragenderSpielerId).toBe(_spieler[0].id);
            expect(kartenErhaltenVomSpieler.gebenderSpielerId).toBe(_spieler[1].id);

            expect(kartenErhaltenVomSpieler.erhalteneKarten.length).toBeGreaterThanOrEqual(2);
            expect(kartenErhaltenVomSpieler.erhalteneKarten[0].wert).toBe(Wert.Fünf);
            expect(kartenErhaltenVomSpieler.erhalteneKarten[1].wert).toBe(Wert.Fünf);

            expect(spiel.spieler[0].karten.filter(karten => karten.wert === Wert.Fünf).length).toBeGreaterThanOrEqual(2);
            expect(spiel.spieler[1].karten.filter(karten => karten.wert === Wert.Fünf).length).toBe(0);

            done(); 
        });

        spiel.starten(_spielkarten, _spieler);        
    });

});