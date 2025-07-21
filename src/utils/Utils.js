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

export function extractErrorMessage(error) {
    // Axios error with response and message from backend
    if (error?.response?.data?.message) {
        return error.response.data.message;
    }
    // Axios error with response and errors array (common in validation errors)
    if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        return error.response.data.errors.map(e => e.msg || e.message).join(', ');
    }
    // Axios error with generic response data message (fallback)
    if (error?.response?.data) {
        if (typeof error.response.data === 'string') return error.response.data;
        if (error.response.data.error) return error.response.data.error;
    }
    // Generic error.message fallback
    if (error?.message) {
        return error.message;
    }
    // Fallback string
    return "An unknown error occurred";
}
