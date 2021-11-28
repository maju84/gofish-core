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


        spiel.starten(_spielkarten, _spieler);

        expect(spiel.deck.length).toBe(52);
        expect(spiel.spieler.length).toBe(2);
        


    });

});