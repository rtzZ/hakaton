import {useCallback, useEffect, useState} from "react";
import {sortArr} from "../utils/sortArr";
import {toggle} from "../utils/toggle";
import {sortArrofObjByTime} from "../utils/sortArrofObjByTime";

// Хук для сортировки массива объектов в порядке возрастания / убывания
export const useSortFilter = (data) => {
    const [sortedData, setSortedData] = useState(data)
    const [sortFieldName, setSortFieldName] = useState(false)
    const [sortOrderBy, setSortOrderBy] = useState(false)

    useEffect(() => setSortedData(data), [data])

    const sort = (key, sortOrderBy, isData) => {
        if (isData) {
            setSortedData(sortArrofObjByTime(sortedData, key, sortOrderBy, true))
            return
        }

        setSortedData(sortArr(sortedData, key, sortOrderBy, true))
    }

    // Сбрасывает сортировку, при этом data должна меняться
    // и за счет useEffect изменяется значение sortedData
    const resetSort = useCallback(() => {
        setSortFieldName(false)
        setSortOrderBy(false)
    }, [])

    // Определяет направление сортировки и сортирует.
    // Если новый фильтр является текущим - изменяем направление
    // иначе обновляет имя фильтра и указывает возрастающее направление
    const onSort = (name, isData) => {
        if (sortFieldName === name) {
            const newSortOrderBy = toggle(sortOrderBy, 'asc', 'desc')
            setSortOrderBy(newSortOrderBy)

            sort(name, newSortOrderBy, isData)
            return;
        }

        setSortFieldName(name)
        setSortOrderBy('asc');
        sort(name, 'asc', isData)
    }

    return {resetSort, sortedData, sortFieldName, sortOrderBy, onSort}
}