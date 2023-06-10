import {useParams} from "react-router-dom";
import {useCallback, useMemo, useState} from "react";

import {
    Autocomplete,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow, TextField,
    Typography
} from "@mui/material";

import {useGetObjectInfoQuery, useGetObjectRecommendationsQuery} from "../../../entities/commonStore";

import {PageWrapper} from "../../../features/pageWrapper";
import {PaperLayout} from "../../../shared/layout";
import {renameObject} from "../../../shared/rename/utils/renameObject";
import {SideAlert} from "../../../shared/sideAlert";
import {ErrorPage} from "../../../features/errorPage";
import {LoadingPage} from "../../../features/loadingPage";
import {objectInfoToUi} from "../const/objectInfoToUI";
import {objectRecommendationToUI} from "../const/objectRecommendationToUI";
import {TableFilter, usePagination} from "../../../features/tableFilter";
import {InputText} from "../../../entities/inputText";
import {workType} from "../const/workType";

const recommendationPriority = ['Высокий приоритет', 'Средний приоритет', 'Низкий приоритет']

// Блоки рекомендаций
const RecommendationBlock = ({id, favoriteRecommendation}) => {
    const {data: recommendations, isLoading, isSuccess, error} = useGetObjectRecommendationsQuery(id) // получение рекоммендаций

    const sortedRecommendation = useMemo(() => {
        const sortRec = [favoriteRecommendation]
        if (!recommendations)
            return recommendations

        recommendations.forEach((recommend) => {
            if (recommend.id === favoriteRecommendation.id)
                return
            sortRec.push(recommend)
        })
        return sortRec
    }, [recommendations])

    if (error) {
        return <SideAlert severity='error'>Не удалось загрузить рекомендации</SideAlert>
    } else if (isLoading || !sortedRecommendation) {
        return null
    }

    return (
        sortedRecommendation.map((recommend, i) => {
            return (
                <PaperLayout key={i} elevation={3} sx={{mt: '20px'}}>
                    <TableContainer>
                        <Table sx={{tableLayout: 'fixed'}}>
                            <TableHead>
                                <TableRow sx={{pl: '16px'}}>
                                    <TableCell>
                                        <Typography sx={{fontWeight: 500}}>
                                            {`${recommendationPriority[i]}`}
                                        </Typography>
                                    </TableCell>
                                    <TableCell/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    Object.entries(renameObject(objectRecommendationToUI, recommend)).map(([key, val], i) => {
                                        return (
                                            <TableRow key={i}>
                                                <TableCell>
                                                    <Typography>
                                                        {key}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        key === 'Наименование'
                                                            ? <Autocomplete
                                                                sx={{
                                                                    height: 'min-content',
                                                                    ml: '-12px',
                                                                    "& .MuiOutlinedInput-root": {
                                                                        borderRadius: "0",
                                                                        padding: "0"
                                                                    },
                                                                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                                                                        border: "0px solid #eee"
                                                                    }
                                                                }}
                                                                disablePortal
                                                                defaultValue={val}
                                                                options={workType}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        size='small'
                                                                        name='name'
                                                                        multiline
                                                                    />
                                                                )}
                                                            />
                                                            : <Typography>{val}</Typography>
                                                    }

                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </PaperLayout>
            )
        })
    )
}

const IncidentsBlock = ({incidents}) => {
    const [filteredIncidents, setFilteredIncidents] = useState(incidents)
    const {onChangePage, getPageContent, rowsPerPage, changeRowsPerPage, getPage} = usePagination()

    const getTableBody = () => {
        return (<TableBody>
            {
                getPageContent(filteredIncidents).map((incident, i) => {
                    return (
                        <TableRow key={i}>
                            <TableCell>
                                <Typography>
                                    {incident.name}
                                </Typography>
                            </TableCell>
                            <TableCell align='right'>
                                <Typography>
                                    {incident.date_ext_created.split('T').join(' ')}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )
                })
            }
        </TableBody>)
    }

    const filterBySearch = useCallback((data, searchFilter) => {
        const filterLowerCase = searchFilter.toLowerCase().trim()

        return data.filter(el => {
            const incident = el.name.toLowerCase()

            return incident.includes(filterLowerCase)
        })
    }, [])

    return (
        <TableContainer>
            <TableFilter
                tableBody={getTableBody()}
                onFilter={setFilteredIncidents}
                data={incidents}
            >
                <TableFilter.SearchBanner
                    tooltipTitle='Поиск осуществляется названию инцидента'
                    tooltipPlacement='top'
                    findIntersection={filterBySearch}
                />
                <TableFilter.Cell
                    topic='Название инцидента'
                    align='left'
                    sx={{
                        width: '20%',
                        fontSize: '1rem',
                        lineHeight: '1.5',
                        letterSpacing: '0.00938em',
                        fontWeight: 500
                    }}
                />
                <TableFilter.SortCell
                    topic='Дата'
                    keyName='date_ext_created'
                    isDataCell
                    align='right'
                    sx={{width: '10%', fontSize: '1rem', lineHeight: '1.5', letterSpacing: '0.00938em', fontWeight: 500}}
                />
            </TableFilter>
            <TablePagination
                component='div'
                rowsPerPageOptions={[5, 10, 15, 30]}
                count={filteredIncidents.length}
                page={getPage(filteredIncidents)}
                rowsPerPage={rowsPerPage}
                labelRowsPerPage=''
                onRowsPerPageChange={changeRowsPerPage}
                onPageChange={onChangePage}
            />
        </TableContainer>
    )
}


// Страница рекоммендаций
export const Recommendation = () => {
    const {id} = useParams()

    const {data, error, isLoading, isSuccess} = useGetObjectInfoQuery(id) // получение полной информации объекта

    if (error) {
        return <ErrorPage error={error}/>
    } else if (isLoading) {
        return <LoadingPage/>
    }

    return (
        <PageWrapper>
            <Grid container columnSpacing='20px'>
                <Grid item xl={6} lg={6} sm={12} xs={12} md={6}>
                    <PaperLayout elevation={3}>
                        <TableContainer>
                            <Table sx={{tableLayout: 'fixed'}}>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            <Typography sx={{fontWeight: 500}}>
                                                Полная информация объекта
                                            </Typography>
                                        </TableCell>
                                        <TableCell/>
                                    </TableRow>
                                    {
                                        Object.entries(renameObject(objectInfoToUi, data.build)).map(([key, val], i) => {
                                            let visibleVal = val;

                                            if (val === null) {
                                                return;
                                            } else if (typeof val === 'object') {
                                                visibleVal = val.name
                                            }

                                            return (
                                                <TableRow key={i}>
                                                    <TableCell>
                                                        <Typography>
                                                            {key}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography>
                                                            {visibleVal}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </PaperLayout>
                    <PaperLayout elevation={3}>
                        {
                            isSuccess && <IncidentsBlock incidents={data.incidents}/>
                        }
                    </PaperLayout>
                </Grid>
                <Grid item xl={6} lg={6} sm={12} xs={12} md={6}>
                    {
                        isSuccess &&
                        <RecommendationBlock favoriteRecommendation={data.recommendation} id={data.build.unom}/>
                    }
                </Grid>
            </Grid>
        </PageWrapper>
    )
}
