import * as React from "react";
import {useCallback, useMemo} from "react";
import {Select} from '@alifd/next';

interface BizColumnSetterProps {
    value: string
}

export const BizColumnSetter: React.FC<BizColumnSetterProps> = (props) => {
    const {value} = props;
    const option = useMockOption()
    // console.log('BizColumnSetter:props',props)

    const handleChange = useCallback((value: string, actionType: string, item: Record<string, any>) => {
        console.log('BizColumnSetter:onChange', value, actionType, item);
    }, [])

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
            {label: "公司", value: "公司", option: {align: "center"}},
            {label: "单据金额", value: "单据金额", option: {}},
            {label: "币种", value: "币种", option: {}},
            {label: "完成进度", value: "完成进度", option: {}},
            {label: "到账日期", value: "到账日期", option: {}},
        ]
    }, [])
}