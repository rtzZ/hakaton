import {useCallback, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

import {
    Button,
    Checkbox,
    TableBody,
    TableCell,
    TablePagination,
    Typography
} from "@mui/material";

import {PaperLayout} from "../../../shared/layout";
import {TableFilter, usePagination} from "../../../features/tableFilter";
import {FocusedTableRow} from "../../../shared/focusedTableRow";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {downloadExcel} from "../../../entities/commonStore";
import {URL_LOAD_DATA} from "../../../entities/commonStore/api/apiBase";
import dayjs from "dayjs";

export const RecommendationTable = ({recommendation, file_id}) => {
    const navigate = useNavigate()

    const [filteredRecommendation, setFilteredRecommendation] = useState(recommendation)
    const {onChangePage, getPageContent, rowsPerPage, changeRowsPerPage, getPage} = usePagination()

    useEffect(() => {
        onChangePage('', 0)
    }, [filteredRecommendation, onChangePage])

    useEffect(() => {
        setFilteredRecommendation(recommendation)
    }, [recommendation])

    const onFlatPage = (id) => {
        navigate(`/recommendation/${id}`)
    }

    const onDownloadExcel = () => {
        downloadExcel(`${URL_LOAD_DATA}/download-report?file_id=${file_id}`, dayjs().format('YYYY-MM-DDTHH:mm'))
    }

    const filterBySearch = useCallback((data, searchFilter) => {
        const filterLowerCase = searchFilter.toLowerCase().trim()

        return data.filter(el => {
            const address = el.address.toLowerCase()

            return address.includes(filterLowerCase)
        })
    }, [])

    const getTableBody = () => {
        return (
            <TableBody>
                {
                    getPageContent(filteredRecommendation).map((row, i) => {
                        return (
                            <FocusedTableRow key={i} onClick={() => onFlatPage(row.unom)}>
                                <TableCell align='left' onClick={(e) => e.stopPropagation()} ><Checkbox/></TableCell>
                                <TableCell align='left'>{row.address}</TableCell>
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
                            >
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    color='primary'
                                    disabled={!file_id}
                                    onClick={onDownloadExcel}
                                    startIcon={<FileDownloadIcon/>}
                                >
                                    Скачать Excel
                                </Button>
                            </TableFilter.SearchBanner>
                            <TableFilter.Cell topic='' align='left' sx={{width: '3%'}}/>
                            <TableFilter.Cell topic='Адрес' align='left' sx={{width: '20%'}}/>
                            <TableFilter.SelectCell topic='Рекомендуемый вид работы' keyName='recommendation' align='left' sx={{width: '27%'}}/>
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
