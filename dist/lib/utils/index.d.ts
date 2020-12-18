export declare const isValidateUrl: (url: string) => boolean;
export declare const promiseAll: <T>(
  promises: Promise<T>[],
  limit: number
) => Promise<T[]>;
export declare const getISOString: (date: string) => string;
export declare const getFullUrl: (targetUrl: string, baseUrl: string) => string;
