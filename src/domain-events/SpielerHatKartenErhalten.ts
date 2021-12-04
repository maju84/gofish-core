import Karte from "../value-types/Karte";

export default class SpielerHatKartenErhalten {

    constructor(
        public readonly fragenderSpielerId: string, 
        public readonly gebenderSpielerId: string, 
        public readonly erhalteneKarten: ReadonlyArray<Karte>
    ) {
        Object.freeze(this);
    }

}