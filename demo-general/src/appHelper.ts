import { createFetchHandler } from '@alilc/lowcode-datasource-fetch-handler';
import {format,dateFormat} from './utils'

const appHelper = {
  requestHandlersMap: {
    fetch: createFetchHandler()
  },
  utils: {
    demoUtil: (...params: any[]) => { console.log(`this is a demoUtil with params ${params}`)},
    format,
    dateFormat
  },
  constants: {
    ConstantA: 'ConstantA',
    ConstantB: 'ConstantB'
  }
};
export default appHelper;