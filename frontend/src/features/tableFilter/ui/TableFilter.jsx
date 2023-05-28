import {Children, cloneElement, useDeferredValue, useEffect, useState} from "react";
import {useSortFilter} from "../hooks/useSortFilter";
import {SearchBanner} from "./SearchBanner";
import {SortCell} from "./SortCell";
import {BaseCell} from "./BaseCell";
import {SelectCell} from "./SelectCell";
import {Table, TableHead, TableRow} from "@mui/material";

// Сортирует таблицу в зависимости от выбранных опций в SelectCell
// направлению сортировки asc/desc в SortCell
// onFilter в useCallback должен быть обернут всегда
const TableFilter = ({data, onFilter, children, tableBody}) => {
    const [searchFilter, setSearchFilter] = useState('')
    const defferedFilterSearch = useDeferredValue(searchFilter)
    const [searchedData, setSearchedData] = useState(data)

    const [filteredData, setFilteredData] = useState(data)
    const [selectedCell, setSelectedCell] = useState([]) // тип [{keyName: '', options: []}]

    const {
        resetSort,
        sortedData,
        sortFieldName,
        sortOrderBy,
        onSort
    } = useSortFilter(searchedData.length > filteredData.length ? filteredData : searchedData)

    // Сортировка по опциям, принимает имя ячейки и массив опций
    const onChangeSelectOpt = (cellName, options) => {
        const newSelectedCell = selectedCell.findIndex(opt => opt.keyName == cellName) // Проверяем фильтруется ли уже эта ячейка
        let newSelectedOpt;

        if (!~newSelectedCell && !options.length) // нет ячейки и опций нет (1 рендер)
            return

        if (!options.length && ~newSelectedCell) { // фильтруется, но опций нет - удаляем из фильтрующихся ячеек
            newSelectedOpt = selectedCell.filter(opt => opt.keyName != cellName)
        } else if (~newSelectedCell) { // ячейка фильтровалась - добавляем новые опции
            newSelectedOpt = selectedCell.map(opt => opt.keyName == cellName ? {...opt, options} : opt)
        } else { // ячейка не фильтровалась - добавляем новую ячейку с опциями
            newSelectedOpt = [...selectedCell, {keyName: cellName, options}]
        }

        setSelectedCell(newSelectedOpt)

        // Проходимся по всем данным и проверяем что ячейка есть во всех фильтрующихся опциях ячейки
        const selectedData = data.filter(data => {
            return newSelectedOpt.every(({options, keyName}) => options.some(option => option == data[keyName]))
        })

        setSearchFilter('')
        setSearchedData(selectedData)
        resetSort()
        setFilteredData(selectedData)
        onFilter(selectedData)
    }

    const onSearchInput = (e) => {
        setSearchFilter(e.target.value)
    }

    // Изменяем каждый раз данные, если отсортировали данные (asc / desc)
    useEffect(() => {
        onFilter(sortedData)
    }, [sortedData, onFilter])

    // Изменяем данные, если они отфильтровались по поиску
    useEffect(() => {
        resetSort()
        onFilter(searchedData)
    }, [searchedData, onFilter])

    return (
        <>
            {
                // Поиск ведется только из фильтрованных данных
                Children.map(children, child => {
                    if (child?.type?.customFuncName === 'SearchBanner') {
                        return cloneElement(child, {
                            defferFilterValue: defferedFilterSearch,
                            onFilter: setSearchedData,
                            data: filteredData,
                            filterValue: searchFilter,
                            onSearchInput,
                        })
                    }

                    return null
                })
            }
            <Table sx={{tableLayout: 'fixed'}}>
                <TableHead>
                    <TableRow>
                        {
                            Children.map(children, child => {
                                switch (child?.type?.customFuncName) {
                                    case 'SortCell':
                                        return cloneElement(child, {
                                            onSort,
                                            sortOrderBy,
                                            activeName: sortFieldName
                                        })
                                    case 'SelectCell':
                                        return cloneElement(child, {
                                            data,
                                            onFilter: onChangeSelectOpt,
                                        })
                                    case 'BaseCell':
                                        return child
                                    default:
                                        return null
                                }
                            })
                        }
                    </TableRow>
                </TableHead>
                {tableBody}
            </Table>
        </>
    )
}

TableFilter.SearchBanner = SearchBanner
TableFilter.SortCell = SortCell
TableFilter.SelectCell = SelectCell
TableFilter.Cell = BaseCell

export {TableFilter}
