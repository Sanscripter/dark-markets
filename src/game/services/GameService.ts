import Transaction from '../classes/Transactions';

export default class GameService {
    saveTransactions(transactions: Transaction[]){
        localStorage.setItem('transactions',JSON.stringify(transactions));
    }
    retrieveTransactions(){
        return JSON.parse(localStorage.getItem('transactions') || '');
    }
}