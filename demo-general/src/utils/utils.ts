function createUtils(){
    return {
        isNil(x:any){
            return x === undefined || x === null || x === ''
        }
    }
}

export const utils = createUtils()