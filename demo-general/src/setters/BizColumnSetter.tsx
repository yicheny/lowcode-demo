import * as React from "react";
import {useCallback, useEffect, useMemo} from "react";
import {Select} from '@alifd/next';
import _ from 'lodash'

interface BizColumnSetterProps {
    value: string,
    onChange: (value: string) => void,
}

export const BizColumnSetter: React.FC<BizColumnSetterProps> = (props) => {
    const {value, onChange} = props;
    const option = useMockOption()

    const handleChange = useCallback((value: string, actionType: string, item: Record<string, any>) => {
        // console.log('BizColumnSetter:onChange', value, actionType, item);
        onChange(value)
        setOption()
        return null

        function setOption(){
            _.forEach(item.option,(value,key)=>{
                // @ts-ignore
                props.field.parent.setPropValue(key, value)
            })
        }
    }, [onChange])

    return <Select
        showSearch
        defaultValue={value}
        onChange={handleChange}
        dataSource={option}
    />
}

function useMockOption() {
    return useMemo(() => {
        return [
            {label: "公司", value: "公司", option: {align: "left"}},
            {label: "单据金额", value: "单据金额", option: {align: "center"}},
            {label: "币种", value: "币种", option: {align: "right"}},
            {label: "完成进度", value: "完成进度", option: {align: "center"}},
            {label: "到账日期", value: "到账日期", option: {align: "center"}},
        ]
    }, [])
}