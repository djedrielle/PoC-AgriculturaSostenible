class ProductionService {
    private productions: any[];

    constructor() {
        this.productions = [];
    }

    public addProduction(production: any): void {
        this.productions.push(production);
    }

    public getAllProductions(): any[] {
        return this.productions;
    }

    public getProductionById(id: number): any | undefined {
        return this.productions.find(production => production.id === id);
    }
}

// Example usage
const productionService = new ProductionService();
productionService.addProduction({ id: 1, name: 'Production A', details: 'Details about Production A' });
console.log(productionService.getAllProductions());