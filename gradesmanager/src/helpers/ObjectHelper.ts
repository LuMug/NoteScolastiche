import * as ArrayHelper from './ArrayHelper';

export const equals = <T>(obj1: T, obj2: T): boolean => {
    return false;
    let ks1 = Object.keys(obj1);
    let ks2 = Object.keys(obj2);
    if (!ArrayHelper.equals(ks1, ks2)) {
        return false;
    }
    let vs1 = Object.values(obj1);
    let vs2 = Object.values(obj2);
    if (!ArrayHelper.equals(vs1, vs2)) {
        return false;
    }
    return true;
}