import dayjs from "dayjs";
import { DATE_FORMAT } from "../constants/ConstantsKey";
import _ from "lodash";

export const showFormatDate = (date) => {
    if (dayjs.isDayjs(date)) {
        date = dayjs(date.$d || date);
    } else {
        date = dayjs(date);
    }
    if (!date.isValid()) {
        return "Invaild Date";
    }

    return date.format(DATE_FORMAT);
}

//Follow Flow Tailwind Responsive
export const antdResponsive = (settings = { xxs: {}, xs: {}, sm: {}, md: {}, lg: {}, xl: {} }) => {
    const responsive = [];
    if (!_.isEmpty(settings.xxs)) {
        responsive.push({
            breakpoint: 439,
            settings: settings.xxs,
        })
    }

    if (!_.isEmpty(settings.xs)) {
        responsive.push({
            breakpoint: 639,
            settings: settings.xs,
        })
    }

    if (!_.isEmpty(settings.sm)) {
        responsive.push({
            breakpoint: 767,
            settings: settings.sm,
        })
    }

    if (!_.isEmpty(settings.md)) {
        responsive.push({
            breakpoint: 1023,
            settings: settings.md,
        })
    }

    if (!_.isEmpty(settings.lg)) {
        responsive.push({
            breakpoint: 1279,
            settings: settings.lg,
        })
    }

    if (!_.isEmpty(settings.lx)) {
        responsive.push({
            breakpoint: 1535,
            settings: settings.xl,
        })
    }

    return responsive;
}

export const objectToQuery = (uri, obj) => {
    const cleanedObj = _.omitBy(obj, value => value === null || value === undefined || value === '' || value === false || Number.isNaN(value));

    return `${uri}?` + Object.keys(cleanedObj).map(key => key + '=' + cleanedObj[key]).join('&');
};