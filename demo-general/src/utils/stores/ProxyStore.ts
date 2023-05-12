import {store} from './StoreCore'

export class ProxyStore{
    protected key:string;

    static create(key:string){
        return new ProxyStore(key)
    }

    constructor(key:string) {
        this.key = key
    }

    read(){
        return store.get(this.key)
    }

    write(data:any){
        return store.set(this.key, data)
    }
}
