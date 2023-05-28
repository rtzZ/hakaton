import {useNavigate} from "react-router-dom";
import {useTheme} from "@mui/material/styles";

import {Box, Grid} from "@mui/material";

import {PageLayout} from "../../../shared/layout";
import {FocusedTypography} from "../../../shared/typography";

export const Header = () => {
    const {palette} = useTheme()
    const navigate = useNavigate()

    const onLogout = () => {
        localStorage.removeItem('token')
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
                                    onClick={() => navigate('/user')}
                                    focusColor='#026595'
                                    color='#0e2b46'
                                >
                                    Запустить модель
                                </FocusedTypography>
                            </Grid>
                            <Grid item>
                                <FocusedTypography
                                    onClick={() => navigate('/admin')}
                                    focusColor='#026595'
                                    color='#0e2b46'
                                >
                                    Обучить модель
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
                            Выйти
                        </FocusedTypography>
                    </Grid>
                </Grid>
            </PageLayout>
        </Box>
    )
}