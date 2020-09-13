export default class Wallet {
    private funds: number = 0;

    setFunds(newFunds: number) {
        this.funds = newFunds;
    }

    getFunds() {
        return this.funds;
    }
}
