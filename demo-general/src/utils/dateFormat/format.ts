import _ from 'lodash'

//----------------基础方法定义--------------
const formatProxy = (formatCore:(d:Date)=>string) => (d:Date) => {
    if(!_.isDate(d)) return null;
    if(String(d) === 'Invalid Date') return null;
    return formatCore(d)
}

function add0(x:number | string) {
    return x < 10 ? `0${x}` : x
}

//----------------格式化核心方法--------------
function dateToYMDHMSCore(d:Date):string{
    return `${dateToYMDCore(d)} ${dateToHMSCore(d)}`
}

function dateToYMDCore(d:Date){
    return `${d.getFullYear()}-${add0(d.getMonth() + 1)}-${add0(d.getDate())}`
}

function dateToHMSCore(d:Date){
    return `${add0(d.getHours())}:${add0(d.getMinutes())}:${add0(d.getSeconds())}`
}

//----------------导出-------------
export const dateToYMDHMS = formatProxy(dateToYMDHMSCore)