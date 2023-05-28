import {useCallback, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography
} from "@mui/material";

import {PaperLayout} from "../../../shared/layout";
import {TableFilter, usePagination} from "../../../features/tableFilter";
import {FocusedTableRow} from "../../../shared/focusedTableRow";


export const RecommendationTable = ({recommendation}) => {
    const navigate = useNavigate()

    const [filteredRecommendation, setFilteredRecommendation] = useState(recommendation)
    const {onChangePage, getPageContent, rowsPerPage, changeRowsPerPage, getPage} = usePagination()

    useEffect(() => {
        onChangePage('', 0)
    }, [filteredRecommendation, onChangePage])

    useEffect(() => {
        setFilteredRecommendation(recommendation)
    }, [recommendation])

    const onFlatPage = (id: number) => {
        navigate(`/recommendation/${id}`)
    }

    const filterBySearch = useCallback((data, searchFilter) => {
        const filterLowerCase = searchFilter.toLowerCase().trim()

        return data.filter(el => {
            const address = el.address.toLowerCase()

            return address.includes(filterLowerCase)
        })
    })

    const getTableBody = () => {
        return (
            <TableBody>
                {
                    getPageContent(filteredRecommendation).map((row, i) => {
                        return (
                            <FocusedTableRow key={i} onClick={() => onFlatPage(row.unom)}>
                                <TableCell align='left' >{row.address}</TableCell>
                                <TableCell align='left'>{row.recommendation}</TableCell>
                                <TableCell align='center'>{row.col_756}</TableCell>
                                <TableCell align='center'>{row.col_761}</TableCell>
                                <TableCell align='center'>{row.col_760}</TableCell>
                                <TableCell align='center'>{row.col_771}</TableCell>
                                <TableCell align='center'>{row.col_770}</TableCell>
                            </FocusedTableRow>
                        )
                    })
                }
            </TableBody>
        )
    }

    return (
        <PaperLayout elevation={3}>
            {
                !recommendation.length
                    ? <Typography >
                        По данным фильтрам нет результатов
                    </Typography>
                    : <>
                        <TableFilter
                            onFilter={setFilteredRecommendation}
                            data={recommendation}
                            tableBody={getTableBody()}
                        >
                            <TableFilter.SearchBanner
                                tooltipTitle='Поиск осуществляется по адресу'
                                tooltipPlacement='top'
                                findIntersection={filterBySearch}
                            />
                            <TableFilter.Cell topic='Адрес' align='left' sx={{width: '20%'}}/>
                            <TableFilter.SelectCell topic='Рекомендуемый вид работы' keyName='recommendation' align='left' sx={{width: '30%'}}/>
                            <TableFilter.SelectCell topic='Год постройки' keyName='col_756' align='center' sx={{width: '10%'}}/>
                            <TableFilter.SortCell topic='Количество квартир' keyName='col_761' align='center' sx={{width: '10%'}}/>
                            <TableFilter.SelectCell topic='Количество подъездов' keyName='col_760' align='center' sx={{width: '10%'}}/>
                            <TableFilter.SortCell topic='Количество лифтов' keyName='col_771' align='center' sx={{width: '10%'}}/>
                            <TableFilter.SelectCell topic='Здание аварийное' keyName='col_770' align='center' sx={{width: '10%'}}/>
                        </TableFilter>
                        <TablePagination
                            component='div'
                            rowsPerPageOptions={[5, 10, 15, 30]}
                            count={filteredRecommendation.length}
                            page={getPage(filteredRecommendation)}
                            rowsPerPage={rowsPerPage}
                            labelRowsPerPage=''
                            onRowsPerPageChange={changeRowsPerPage}
                            onPageChange={onChangePage}
                        />
                    </>
            }
        </PaperLayout>
    )
}
