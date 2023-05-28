import {useCallback, useState} from "react";

// Хук для пагинации таблицы
// Принимает количество строк в таблицу, возвращает текущую страницу, функцию которую
// обрезает контент исходя из текущей страницы, и функцию которая изменяет номер страницы
export const usePagination = (rowsPerPageInit = 10) => {
    const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageInit)
    const [page, setPage] = useState(0)

    const onChangePage = useCallback((event, newPage) => {
        setPage(newPage)
    }, [])

    const changeRowsPerPage = useCallback(event => {
        setPage(0)
        setRowsPerPage(+event.target.value)
    })

    const getPageContent = useCallback(content => {
        return content.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    }, [rowsPerPage, page])

    // Если данных стало меньше и такой страницы существовать не может, то
    // переключится на 1 страницу
    const getPage = useCallback(content => {
        return Math.trunc(content.length / rowsPerPage) < page ? 0 : page
    }, [rowsPerPage, page])

    return {onChangePage, getPageContent, rowsPerPage, changeRowsPerPage, getPage}
}
