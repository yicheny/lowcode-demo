import _ from 'lodash'

class GlobalControl{
    pool: { saveRefresh: () => void }

    constructor() {
        this.pool = {
            saveRefresh:()=>{}
        }
    }

    setTemplateRefresh(c: () => void){
        if(_.isFunction(c)) this.pool.saveRefresh = c
    }

    getTemplateRefresh(){
        return this.pool.saveRefresh
    }
}

export const globalControl = new GlobalControl()
