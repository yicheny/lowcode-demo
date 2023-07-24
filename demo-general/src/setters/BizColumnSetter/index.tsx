import * as React from "react";
import {useCallback} from "react";
import {Select} from '@alifd/next';
import _ from 'lodash'
import {useOption} from "./useOption";

interface BizColumnSetterProps {
    value: string,
    onChange: (value: string) => void,
}

export const BizColumnSetter: React.FC<BizColumnSetterProps> = (props) => {
    const {value, onChange} = props;
    const { option } = useOption()

    const handleChange = useCallback((value: string, actionType: string, item: Record<string, any>) => {
        // console.log('BizColumnSetter:onChange', value, actionType, item);
        onChange(value)
        setOption()
        return null

        function setOption() {
            _.forEach(item.option, (value, key) => {
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