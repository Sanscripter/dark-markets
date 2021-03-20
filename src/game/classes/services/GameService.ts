import Transaction from '../Transactions';

export default class GameService {
    saveTransactions(transactions: Transaction[]){
        localStorage.setItem('transactions',JSON.stringify(transactions));
    }
    retrieveTransactions(){
        return JSON.parse(localStorage.getItem('transactions') || '');
    }
    saveDate(day: number) {
        localStorage.setItem('date', day.toString());
    }
    retrieveDate() {
        return localStorage.getItem('date');
    }
}