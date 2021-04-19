import isFunction from 'isFunction';

const GLOBAL_OBJECT: typeof global = Function('return this')();

const proxySupported = (): boolean => isFunction(GLOBAL_OBJECT.Proxy);

export default proxySupported;
