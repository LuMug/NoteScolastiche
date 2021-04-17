import * as ObjectHelper from './ObjectHelper';

export const shuffle = (array: Array<any>) => {
    let arr = [...array];
    let currentIndex = arr.length, temporaryValue, randomIndex;
    while (0 != currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = arr[currentIndex];
        arr[currentIndex] = arr[randomIndex];
        arr[randomIndex] = temporaryValue;
    }
    return arr;
}

export const equals = <T>(arr1: Array<T>, arr2: Array<T>): boolean => {
    let _arr1 = arr1;// Object.assign({}, arr1);
    let _arr2 = arr2;//Object.assign({}, arr2);

    _arr1.sort((a, b) => {
        if (a > b) {
            return 1;
        } else if (a < b) {
            return -1;
        }
        return 0;
    });
    _arr2.sort((a, b) => {
        if (a > b) {
            return 1;
        } else if (a < b) {
            return -1;
        }
        return 0;
    });
    _arr1.forEach((e, i) => {
        if (typeof e == 'object') {
            if (!ObjectHelper.equals(e, _arr2[i])) {
                return false;
            }
        } else if (e !== _arr2[i]) {
            return false;
        }
    });
    return true;
}