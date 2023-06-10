import dayjs from "dayjs";

export const sortArrofObjByTime = (arr, keyName, direction, isImmutable) => {
    const copyArr = isImmutable ? JSON.parse(JSON.stringify(arr)) : arr
    const sortDirection = direction === 'desc' ? 1 : -1

    return copyArr.sort((a, b) => {
        const dataA = Date.parse(dayjs(a[keyName]).format('YYYY-MM-DDTHH:mm:ss'))
        const dataB = Date.parse(dayjs(b[keyName]).format('YYYY-MM-DDTHH:mm:ss'))

        // делает сортировку стабильной
        if (dataA === dataB)
            return 1

        return (dataA > dataB ? -1 : 1) * sortDirection
    })
}