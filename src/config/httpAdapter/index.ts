import * as qs from 'qs';

export const httpOptions = {
  querystringParser: (str: string) => qs.parse(str),
};

export const DEFAULT_TIMEOUT_MS = 10000
