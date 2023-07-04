import _ from 'lodash';

type Data = Array<Record<any, any>>
type Options = Array<Record<any, any>>

type downCsvProps = {
    title:string,
    data:Data,
    options:Options
}

export function downCsv(props:downCsvProps){
    // console.log('downCsv', props)

    const {title, data, options} = props

    const info = createInfo(data,options)
    // console.log('info', info)
    const str = encodeURIComponent(info)
    const csv = document.createElement('a')
    const href_header = isNil(info) ? `data:text/csv;charset=utf-8,` : `data:text/csv;charset=utf-8,\ufeff`
    csv.href = href_header.concat(str)
    csv.download = title.endsWith('.csv') ? title : title.concat('.csv')
    csv.click()

    function createInfo(data:Data,options:Options): string{
        const symbol = ','
        const headerInfo = _.map(options, x => x.title).join(symbol).concat('\n');
        const contentInfo = _.map(data, formatRowInfo).join('\n')
        return headerInfo.concat(contentInfo)

        function formatRowInfo(o:Record<any, any>){
            return _.map(options,option => {
                const value = o[option.dataIndex];
                const res = option.cell ? option.cell(value) : value;
                return `"${res}"`
            })
        }
    }
}

function isNil(x:any){
    return x === undefined || x === null || x === ''
}
