import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";

import {Box, Grid} from "@mui/material";

import {PageLayout} from "../../../shared/layout";
import {FocusedTypography} from "../../../shared/typography";
import {setObjects} from "../../../entities/commonStore";

export const Header = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const isSigned = !!localStorage.getItem('token')

    const onLogout = () => {
        if (isSigned)
            localStorage.removeItem('token')

        // @ts-ignore
        dispatch(setObjects([]))
        navigate('/login')
    }

    return (
        <Box
            sx={{
                position: 'relative',
                height: '48px',
                width: '100%',
                bgcolor: 'white',
                zIndex: 1,
            }}
        >
            <PageLayout>
                <Grid
                    container
                    justifyContent='space-between'
                    alignItems='center'
                    m='auto'
                    height='100%'
                    color='#ffffff'
                >
                    <Grid item>
                        <Grid container columnSpacing='20px'>
                            <Grid item>
                                <FocusedTypography
                                    onClick={() => navigate('/recommendation')}
                                    focusColor='#026595'
                                    color='#0e2b46'
                                >
                                    Поиск объектов
                                </FocusedTypography>
                            </Grid>
                            <Grid item>
                                <FocusedTypography
                                    onClick={() => navigate('/learn-model/upload')}
                                    focusColor='#026595'
                                    color='#0e2b46'
                                >
                                    Загрузка данных
                                </FocusedTypography>
                            </Grid>
                            <Grid item>
                                <FocusedTypography
                                    onClick={() => navigate('/learn-model')}
                                    focusColor='#026595'
                                    color='#0e2b46'
                                >
                                    Обучение моделей
                                </FocusedTypography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item sx={{alignSelf: 'right'}}>
                        <FocusedTypography
                            onClick={onLogout}
                            focusColor='#026595'
                            color='#0e2b46'
                        >
                            {isSigned ? 'Выйти' : 'Войти'}
                        </FocusedTypography>
                    </Grid>
                </Grid>
            </PageLayout>
        </Box>
    )
}