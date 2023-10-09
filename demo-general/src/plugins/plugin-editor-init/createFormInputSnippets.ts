import {lowApi} from "../../utils";

export async function createFormInputSnippets(){
    //"url": 'http://172.20.1.20:19001/api/material/detail/query',
    const option = await lowApi.post('/api/material/detail/query')
    return transform(option,'BizFormInput')
}

//转换
function transform(option: any[], componentName: any) {
    return option.map((o: any)=>{
        const {nameChinese,description} = mapFiled(o);
        const title = description ? `${nameChinese}_${description}` : nameChinese
        return {
            // "mark": "测试transform自定义",
            "title":title,
            "screenshot": "",
            "schema": {
                "componentName":componentName,
                "props": o
            }
        }
    })

    //映射字段
    function mapFiled(o: { [x: string]: any; }){
        const filedList = [
            ['nameChinese', 'fieldCnName'],
            ['nameEnglish', 'fieldEnName'],
            ['description', 'fieldDesc'],
            ['max', 'maxValue'],
            ['min', 'minValue'],
            ['precision', 'numPrecision'],
        ]

        filedList.forEach((fileds)=>{
            const [newFiled,oldFiled] = fileds;
            o[newFiled] = o[oldFiled]
            delete o[oldFiled]
        })

        return o;
    }
}