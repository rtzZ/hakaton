import * as yup from "yup";
import dayjs from "dayjs";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";

import {Box, Grid, MenuItem} from "@mui/material";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {
    objectsSelector, setObjects,
    useGetAllObjectsQuery,
    useGetLearningModelsQuery,
    useSetLearningModelsMutation
} from "../../../entities/commonStore";

import {SideAlert} from "../../../shared/sideAlert";
import {PaperLayout} from "../../../shared/layout";
import {SubmitButton} from "../../../shared/button";
import {PageWrapper} from "../../../features/pageWrapper";
import {SelectInput, TextInput} from "../../../features/controlledInput";
import {SuggestInput} from "../../../features/suggestInput";
import {accidentBuildOpt} from "../const/accidentBuildOpt";
import {RecommendationTable} from "./RecommendationTable";
import {ModalLoading} from "../../../entities/loading";
import {FocusedTypography} from "../../../shared/typography";

const validationSchema = yup.object({name: yup.string().required('Обязательное поле'),})

type FormData = yup.InferType<typeof validationSchema>


// Формирование значений для фильтров
const years: string[] = []

let year = +dayjs().format('YYYY')
for (year; year >= 1600; year--) {
    years.push(`${year}`);
}

const hallCountOpt: string[] = []
const flatCountOpt: string[] = []

for (let i = 1; i < 200; i++) {
    if (i < 18) {
        hallCountOpt.push(`${i}`)
    }
    flatCountOpt.push(`${i}`)
}


// Страница получения рекомендаций по объектам
export const User = () => {
    const dispatch = useDispatch()
    const previousAllObjects = useSelector(objectsSelector) // получем предыдущие значения рекомендаций, используется если еще не получались новые рекомендации

    const {data: models, isSuccess: isSuccessModels, error: getModels} = useGetLearningModelsQuery() // получение модели
    const [sendSelectedModel, {error: sendModelError}] = useSetLearningModelsMutation() // отправление выбранной модели

    const [build_year, setBuild_year] = useState<string[]>([])
    const [hall_count, setHall_count] = useState<string[]>([])
    const [flat_count, setFlat_count] = useState<string[]>([])

    const [queryParam, setQueryParams] = useState<{ [x: string]: any }>({});
    const [isSubmit, setIsSubmit] = useState<boolean>(false)
    const [showAllFilters, setShowAllFilters] = useState<boolean>(false)

    const [normalizeRecommendation, setNormalizeRecommendation] = useState<any[] | null>(null); // форматированные данные для отрисовки таблицы

    const [isFetchRecommendation, setIsFetchRecommendation] = useState<boolean>(false)
    const {
        refetch: fetchRecommendation,
        data: recommendation,
        error: errorRecommendation,
        isSuccess: isSuccessRecommendation,
        isFetching: isFetchingRecommendation
    } = useGetAllObjectsQuery(queryParam, {skip: !isFetchRecommendation}) // получение рекомендаций


    const {control, setValue, handleSubmit, watch, formState: {errors}} = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            name: '',
            lift_count: '',
            accident_id: '',
            model: ''
        }
    });

    const selectedModelId = watch('model')

    useEffect(() => {
        if (selectedModelId) {
            sendSelectedModel(selectedModelId)
        }
    }, [selectedModelId, sendSelectedModel])

    useEffect(() => {
        if (isSuccessRecommendation) {
            const normalizedData = recommendation.map((recommendation: any) => {
                const normalizeRecommend = JSON.parse(JSON.stringify(recommendation?.build))

                normalizeRecommend.recommendation = recommendation.recommendation.name

                return normalizeRecommend
            })

            dispatch(setObjects(normalizedData))
            setNormalizeRecommendation(normalizedData)
        }

    }, [isSuccessRecommendation, dispatch, recommendation]) // при загрузке данных нормальзуем их

    // Находим активную модель и инициализируем форму
    useEffect(() => {
        if (isSuccessModels && models?.length) {
            setValue('model', models.filter((model: any) => model.is_selected)[0].id)
        } else if (sendModelError) {
            setValue('model', '')
        }
    }, [isSuccessModels, sendModelError, setValue, models])

    // Формируем данные для запроса при сабмите формы
    const onSubmit = (queries: FormData) => {
        setIsSubmit(true)
        setIsFetchRecommendation(true)

        const copyQueries = JSON.parse(JSON.stringify(queries))
        delete copyQueries.model

        setQueryParams(
            {
                ...copyQueries,
                build_year: build_year.join(','),
                hall_count: hall_count.join(','),
                flat_count: flat_count.join(',')
            }
        )
    }

    useEffect(() => {
        if (isSubmit) {
            fetchRecommendation()
        }
    }, [queryParam, isSubmit])


    return (
        <PageWrapper>
            {getModels && <SideAlert severity='error'>Не удалось загрузить модели</SideAlert>}
            {sendModelError && <SideAlert severity='error'>Не удалось выбрать модель</SideAlert>}
            {errorRecommendation && <SideAlert severity='error'>Не удалось загрузить рекомендации</SideAlert>}
            {!isSuccessModels ? null : models.length ? null : <SideAlert severity='error'>Нет активных моделей</SideAlert>}
            {isFetchingRecommendation && <ModalLoading/>}
            <PaperLayout elevation={3}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing='20px'>
                        <Grid item xl={6} lg={6} xs={12} sm={12} md={12}>
                            <TextInput
                                errors={errors}
                                control={control}
                                label='Адрес'
                                name='name'
                            />
                        </Grid>
                        {
                            isSuccessModels &&
                            <Grid item xl={6} lg={6} xs={12} sm={12} md={12}>
                                <SelectInput
                                    errors={errors}
                                    control={control}
                                    name='model'
                                    labelName='Выбор модели'
                                >
                                    {
                                        models.map((model: any) => {
                                            return (
                                                <MenuItem
                                                    key={model.id}
                                                    value={model.id}
                                                >
                                                    {model.name}
                                                </MenuItem>
                                            )
                                        })
                                    }
                                </SelectInput>
                            </Grid>
                        }
                        <Grid item xl={12} lg={12} xs={12} sm={12} md={12}>
                            <SuggestInput
                                data={years}
                                onSave={setBuild_year}
                                label='Год постройки'
                            />
                        </Grid>
                        {
                            showAllFilters
                            && <>
                                <Grid item xl={6} lg={6} xs={12} sm={12} md={12}>
                                    <SuggestInput
                                        data={flatCountOpt}
                                        onSave={setFlat_count}
                                        label='Количество квартир'
                                    />
                                </Grid>
                                <Grid item xl={6} lg={6} xs={12} sm={12} md={12}>
                                    <SuggestInput
                                        data={hallCountOpt}
                                        onSave={setHall_count}
                                        label='Количество подъездов'
                                    />
                                </Grid>
                                <Grid item xl={6} lg={6} xs={12} sm={12} md={12}>
                                    <SelectInput
                                        errors={errors}
                                        control={control}
                                        name='lift_count'
                                        labelName='Наличие лифтов'
                                    >
                                        <MenuItem value={0}>Нет</MenuItem>
                                        <MenuItem value={50}>Да</MenuItem>
                                    </SelectInput>
                                </Grid>
                                <Grid item xl={6} lg={6} xs={12} sm={12} md={12}>
                                    <SelectInput
                                        errors={errors}
                                        control={control}
                                        name='accident_id'
                                        labelName='Здание является аварийным'
                                    >
                                        {
                                            accidentBuildOpt.map((opt) => {
                                                return (
                                                    <MenuItem key={opt.value} value={opt.value}>
                                                        {opt.value}
                                                    </MenuItem>
                                                )
                                            })
                                        }
                                    </SelectInput>
                                </Grid>
                            </>
                        }
                        <Grid item xl={12} lg={12} xs={12} sm={12} md={12}
                              sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Box sx={{width: 'max-content'}}>
                                <FocusedTypography
                                    focusColor='#026595'
                                    color='#0e2b46'
                                    sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
                                    onClick={() => setShowAllFilters(prev => !prev)}
                                >
                                    Все параметры
                                    {
                                        showAllFilters ? <ExpandLessIcon/> : <ExpandMoreIcon/>
                                    }
                                </FocusedTypography>
                            </Box>
                            <SubmitButton
                                disabled={!isSuccessModels || !models.length}
                                sx={{width: '20%'}}
                            >
                                Получить результат
                            </SubmitButton>
                        </Grid>
                    </Grid>
                </form>
            </PaperLayout>
            {
                (previousAllObjects.length || normalizeRecommendation) // отрисовывем рекомендации если только есть данные
                && <RecommendationTable recommendation={normalizeRecommendation || previousAllObjects}/>
            }
        </PageWrapper>
    )
}