// принимает массив объектов, имя ключа
// если массив иммутабельный - делается копия
// направление сортировки asc / desc

export const sortArr = (arr, keyName, direction = 'asc', isImmutableArr = false) => {
    const copyArr = isImmutableArr ? JSON.parse(JSON.stringify(arr)) : arr
    const sortDirection = direction === 'desc' ? 1 : -1

    return copyArr.sort((a, b) => {
        // делает сортировку стабильной
        if (a[keyName] === b[keyName])
            return 1

        return (a[keyName] > b[keyName] ? -1 : 1) * sortDirection
    })
}