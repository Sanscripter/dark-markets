import * as Hashes from 'jshashes';
const MD5 = new Hashes.MD5

export default class UniqueElement {
    constructor(name: string){
        this.id = MD5.hex(name);
    }
    public id: string;
}