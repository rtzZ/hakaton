import {useParams} from "react-router-dom";

import {Grid, Table, TableBody, TableCell, TableContainer, TableRow, Typography} from "@mui/material";

import {useGetObjectInfoQuery, useGetObjectRecommendationsQuery} from "../../../entities/commonStore";

import {PageWrapper} from "../../../features/pageWrapper";
import {PaperLayout} from "../../../shared/layout";
import {renameObject} from "../../../shared/rename/utils/renameObject";
import {SideAlert} from "../../../shared/sideAlert";
import {ErrorPage} from "../../../features/errorPage";
import {LoadingPage} from "../../../features/loadingPage";
import {objectInfoToUi} from "../const/objectInfoToUI";
import {objectRecommendationToUI} from "../const/objectRecommendationToUI";

const RecommendationBlock = ({id}: any) => {
    const {data: recommendations, isLoading, error} = useGetObjectRecommendationsQuery(id)

    if (error) {
        return <SideAlert severity='error'>Не удалось загрузить рекомендации</SideAlert>
    } else if (isLoading) {
        return null
    }

    return (
        recommendations.map((recommend: { [x: string]: any }, i: number) => {
            return (
                <PaperLayout key={i} elevation={3} sx={{mt: '20px'}}>
                    <TableContainer>
                        <Table sx={{tableLayout: 'fixed'}}>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <Typography sx={{fontWeight: 500}}>
                                            {`Рекомендация #${i + 1}`}
                                        </Typography>
                                    </TableCell>
                                    <TableCell/>
                                </TableRow>
                                {
                                    Object.entries(renameObject(objectRecommendationToUI, recommend)).map(([key, val], i) => {
                                        const value = val as string
                                        return (
                                            <TableRow key={i}>
                                                <TableCell>
                                                    <Typography>
                                                        {key}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>
                                                        {value}
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
            )
        })
    )
}

export const Recommendation = () => {
    const {id} = useParams()

    const {data, error, isLoading, isSuccess} = useGetObjectInfoQuery(id)

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
                                        Object.entries(renameObject(objectInfoToUi, data)).map(([key, val], i) => {
                                            let visibleVal: any = val;

                                            if (val === null) {
                                                return;
                                                // visibleVal = 'Значение отсутствует'
                                            } else if (typeof val === 'object') {
                                                // @ts-ignore
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
                                                            {visibleVal as unknown as string}
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
                </Grid>
                <Grid item xl={6} lg={6} sm={12} xs={12} md={6}>
                    {
                        isSuccess && <RecommendationBlock id={data.unom}/>
                    }
                </Grid>
            </Grid>
        </PageWrapper>
    )
}
