import compose from "../compose";
import {dateToYMDHMS} from "./format";
import {longToDate} from "./toDate";

export const dateFormat = {
    longToYMDHMS: compose(dateToYMDHMS,longToDate)
}