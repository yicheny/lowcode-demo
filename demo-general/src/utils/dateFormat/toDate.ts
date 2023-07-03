import _ from 'lodash'

export function longToDate(value:string){
    const re = /^([0-9]{4})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})$/;
    if(re.test(value)){
        // @ts-ignore
        const [year,month,day,hour,min,sec] = re.exec(value).slice(1);
        // @ts-ignore
        return new Date(year, month-1, day, hour, min, sec);
    }
    return null;
}