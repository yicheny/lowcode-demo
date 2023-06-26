import * as React from "react";
import {useCallback, useMemo} from "react";
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

function useMockOption() {
    return useMemo(() => {
        return [
            {label: "对手方", value: "对手方", option: {dataIndex: "counterPartyName"}},
            {label: "交易账户", value: "交易账户", option: {dataIndex: "tradingAcctName"}},
            {label: "币种", value: "币种", option: {dataIndex: "currencyId"}},
            {label: "账户余额", value: "账户余额", option: {dataIndex: "cashAmt", align: "right"}},
            {label: "授信额度", value: "授信额度", option: {dataIndex: "creditLimit", align: "right"}},
            {label: "盯市金额", value: '盯市金额', option: {dataIndex: "toMarketAmt", align: "right"}},
            {label: "总维持保证金", value: '总维持保证金', option: {dataIndex: "marginAmt", align: "right"}},
            {label: "互换维持保证金", value: '互换维持保证金', option: {dataIndex: "swapMarginAmt", align: "right"}},
            {label: "期权维持保证金", value: '期权维持保证金', option: {dataIndex: "optionMarginAmt", align: "right"}},
            {label: "追加后履约保证金", value: '追加后履约保证金', option: {dataIndex: "perforMarginAmt"}},
            {label: "授信占用", value: '授信占用', option: {dataIndex: "usedCreditLimit", align: "right"}},
            {label: "待追保金额", value: '待追保金额', option: {dataIndex: "waitingAppendMarginAmt", align: "right"}},
            {label: "开仓可用", value: '开仓可用', option: {dataIndex: "canOpenAmt", align: "right"}},
            {label: "可提取", value: '可提取', option: {dataIndex: "canOutAmt", align: "right"}},
            {label: "维持保证金比率", value: '维持保证金比率', option: {dataIndex: "marginAmtRatio", align: "right"}},
            {label: "更新时间", value: '更新时间', option: {dataIndex: "tradeDate"}},
        ]
        // return [
        //     {label: "公司", value: "公司", option: {align: "left", dataIndex: 'company'}},
        //     {label: "单据金额", value: "单据金额", option: {align: "center", dataIndex: 'documentAmount'}},
        //     {label: "币种", value: "币种", option: {align: "right", dataIndex: 'currency'}},
        //     {label: "完成进度", value: "完成进度", option: {align: "center", dataIndex: "percent"}},
        //     {label: "到账日期", value: "到账日期", option: {align: "center", dataIndex: 'date'}},
        // ]
    }, [])
}