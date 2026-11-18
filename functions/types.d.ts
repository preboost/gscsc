type KVNamespace = any;

type PagesFunction<T = any> = (context: {
  request: Request;
  env: T;
  params?: Record<string, string | string[]>;
  data?: Record<string, any>;
  next?: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  waitUntil?: (promise: Promise<any>) => void;
}) => Response | Promise<Response>;
