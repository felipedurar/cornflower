
// Based on Jeffrey Patterson's answear from this: 
// https://stackoverflow.com/questions/41980195/recursive-partialt-in-typescript
export type CfRecursivePartial<T> = {
    [P in keyof T]?:
    T[P] extends (infer U)[] ? CfRecursivePartial<U>[] :
    T[P] extends object ? CfRecursivePartial<T[P]> :
    T[P];
};
