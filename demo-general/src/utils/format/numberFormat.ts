import _ from 'lodash'

export function numberFormat(format: string){
    return (value: any) => {
        if(isInfiniteNumber(value)) return '-'
        const t = format.charAt(0);
        const n = _.toInteger(format.charAt(1));
        if(t==='N') return custom_format(Number(value).toFixed(n));
        return value.toString()
    }
}

function isInfiniteNumber(value:any){
    return [undefined,null,'',false].includes(value) || !_.isFinite(Number(value))
}

function custom_format(sNum: string){
    const sNumParts = sNum.split('.');
    sNumParts[0] = sNumParts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g,'$1,')
    return sNumParts.join('.')
}

export const N2 = numberFormat('N2');