export default class Wallet {
    private funds = 0;

    setFunds(newFunds: number) {
        this.funds = newFunds;
    }

    getFunds() {
        return this.funds;
    }
}
