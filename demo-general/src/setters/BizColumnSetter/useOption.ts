import {TableMetaStore} from "../../utils/stores";

export function useOption() {
    return {option: TableMetaStore.read()}

    // const {data,doFetch} = usePost()
    //
    // useEffect(()=>{
    //     tryExecute(async ()=>{
    //         await doFetch(`/material/query`)
    //     })
    // },[doFetch])
    //
    // const option = useMemo(()=>{
    //     // console.log('data', data)
    //     return _.map(data,x =>{
    //         const o = safeParse(x.extend);
    //         _.setWith(o, 'option.cell', transformStringToFunction(x.formatContent))
    //         // console.log('o', o);
    //         return o;
    //     })
    // },[data])
    //
    // return {option}
}

