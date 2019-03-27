export class Product {
    constructor(
        public _id: string,
        public name: string,
        public description: string,
        public cost: number,
        public category: string,
        public type: string,
        public images: [string],
        public sale: string
    ) {}
}
