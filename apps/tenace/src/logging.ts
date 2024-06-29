import { IS_DEV_MODE } from "./consts";

export const Log = {
  info: (logHeader: string, logContent: any = "") =>
    IS_DEV_MODE ? console.log(logHeader, logContent) : null,
  error: (logHeader: string, logContent: any = "") =>
    IS_DEV_MODE ? console.error(logHeader, logContent) : null,
  debug: (logHeader: string, logContent: any = "") =>
    IS_DEV_MODE ? console.debug(logHeader, logContent) : null,
};
