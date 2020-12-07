export declare const isValidateUrl: (url: string) => boolean;
export declare const promiseAll: <T>(
  promises: Promise<T>[],
  limit: number
) => Promise<T[]>;
