import { createFetchHandler } from '@alilc/lowcode-datasource-fetch-handler';
import {format,dateFormat} from './utils'
import _ from 'lodash'

const appHelper = {
  requestHandlersMap: {
    fetch: createFetchHandler()
  },
  utils: {
    demoUtil: (...params: any[]) => { console.log(`this is a demoUtil with params ${params}`)},
    _,
    format,
    dateFormat,
  },
  constants: {
    ConstantA: 'ConstantA',
    ConstantB: 'ConstantB'
  }
};
export default appHelper;