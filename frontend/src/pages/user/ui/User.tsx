import dayjs from "dayjs";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useMemo, useRef, useState} from "react";
import {useForm} from "react-hook-form";

import {Autocomplete, Box, Button, ButtonGroup, Grid, MenuItem, TextField, Typography} from "@mui/material";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {
    fileIdSelector,
    objectsSelector, resultViewSelector, setFileId, setObjects, setResultView, useGetAddressQuery,
    useGetAllObjectsQuery,
    useGetLearningModelsQuery,
    useSetLearningModelsMutation
} from "../../../entities/commonStore";

import {SideAlert} from "../../../shared/sideAlert";
import {PaperLayout} from "../../../shared/layout";
import {SubmitButton} from "../../../shared/button";
import {PageWrapper} from "../../../features/pageWrapper";
import {SelectInput} from "../../../features/controlledInput";
import {SuggestInput} from "../../../features/suggestInput";
import {accidentBuildOpt} from "../const/accidentBuildOpt";
import {RecommendationTable} from "./RecommendationTable";
import {ModalLoading} from "../../../entities/loading";
import {FocusedTypography} from "../../../shared/typography";
import {RecommendationMap} from "./RecommendationMap";
import {InputText} from "../../../entities/inputText";

// Формирование значений для фильтров
const years: string[] = []
const corpuses: string[] = []
const houses: string[] = []

let year = +dayjs().format('YYYY')
for (year; year >= 1600; year--) {
    years.push(`${year}`);
}

const hallCountOpt: string[] = []
const flatCountOpt: string[] = []

for (let i = 1; i < 1000; i++) {
    if (i < 18) {
        hallCountOpt.push(`${i}`)
    }
    if (i <= 50) {
        corpuses.push(`${i}`)
    }
    if (i <= 200) {
        houses.push(`${i}`)
    }
    flatCountOpt.push(`${i}`)
}


// Страница получения рекомендаций по объектам
export const User = () => {
    const dispatch = useDispatch()
    const previousAllObjects = useSelector(objectsSelector) // получем предыдущие значения рекомендаций, используется если еще не получались новые рекомендации
    const previousFileId = useSelector(fileIdSelector)
    const previousResultView = useSelector(resultViewSelector)

    const {data: models, isSuccess: isSuccessModels, error: getModelsError} = useGetLearningModelsQuery() // получение модели
    const [sendSelectedModel, {error: sendModelError}] = useSetLearningModelsMutation() // отправление выбранной модели

    const {data: suggestAddresses, error: suggestError} = useGetAddressQuery()

    const [build_year, setBuild_year] = useState<string[]>([])
    const [hall_count, setHall_count] = useState<string[]>([])
    const [house_number, setHouse_number] = useState<string[]>([])
    const [corpus_number, setCorpus_number] = useState<string[]>([])
    const [flat_count, setFlat_count] = useState<string[]>([])
    const [address, setAddress] = useState<string | null>('')
    const addressRef = useRef()

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
        defaultValues: {
            lift_count: '',
            accident_id: '',
            model: ''
        }
    });

    const selectedModelId = watch('model')

    const uniqSuggestAddress = useMemo(() => {
        const uniqAddress: any = {}

        if (suggestAddresses) {
            suggestAddresses.forEach((address: string) => {
                const splittedAddress = address.split(' ')[0]
                if (splittedAddress in uniqAddress)
                    return
                uniqAddress[splittedAddress] = true
            })
        }

        return Object.keys(uniqAddress)
    }, [suggestAddresses])

    useEffect(() => {
        if (selectedModelId) {
            sendSelectedModel(selectedModelId)
        }
    }, [selectedModelId, sendSelectedModel])

    useEffect(() => {
        if (isSuccessRecommendation) {
            const normalizedData = recommendation.buildings.map((recommendation: any) => {
                const normalizeRecommend = JSON.parse(JSON.stringify(recommendation?.build))

                normalizeRecommend.recommendation = recommendation.recommendation.name

                return normalizeRecommend
            })

            dispatch(setFileId(recommendation.file_id))
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

    useEffect(() => {
        if (isSubmit) {
            fetchRecommendation()
        }
    }, [queryParam, isSubmit])

    // Формируем данные для запроса при сабмите формы
    const onSubmit = (queries: any) => {
        if (!address) {
            // @ts-ignore
            addressRef?.current?.focus()
            return
        }

        setIsSubmit(true)
        setIsFetchRecommendation(true)

        const copyQueries = JSON.parse(JSON.stringify(queries))
        delete copyQueries.model

        setQueryParams(
            {
                ...copyQueries,
                name: address,
                house_number: house_number.join(','),
                corpus_number: corpus_number.join(','),
                build_year: build_year.join(','),
                hall_count: hall_count.join(','),
                flat_count: flat_count.join(',')
            }
        )
    }

    const onChangeResultView = (e: any) => {
        dispatch(setResultView(e.target.name))
    }

    const getResultView = () => {
        if (!previousResultView || (!previousAllObjects.length && !normalizeRecommendation))
            return null

        return (
            previousResultView == 'map'
                ? <RecommendationMap recommendation={normalizeRecommendation || previousAllObjects}/>
                : <RecommendationTable
                    recommendation={normalizeRecommendation || previousAllObjects}
                    file_id={recommendation?.file_id || previousFileId}
                />
        )
    }

    return (
        <PageWrapper>
            {suggestError && <SideAlert severity='error'>Не удалось загрузить рекомендации адресов</SideAlert>}
            {getModelsError && <SideAlert severity='error'>Не удалось загрузить модели</SideAlert>}
            {sendModelError && <SideAlert severity='error'>Не удалось выбрать модель</SideAlert>}
            {errorRecommendation && <SideAlert severity='error'>Не удалось загрузить рекомендации</SideAlert>}
            {!isSuccessModels ? null : models.length ? null :
                <SideAlert severity='error'>Нет активных моделей</SideAlert>}
            {isFetchingRecommendation && <ModalLoading/>}
            <PaperLayout elevation={3}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing='20px'>
                        <Grid item xl={6} lg={6} xs={12} sm={12} md={12}>
                            <Autocomplete
                                disablePortal
                                options={uniqSuggestAddress}
                                onChange={(e, val) => setAddress(val)}
                                renderInput={(params) => (
                                    <>
                                        <InputText
                                            label='Адрес'
                                        />
                                        <TextField
                                            {...params}
                                            inputRef={addressRef}
                                            size='small'
                                            name='name'
                                        />
                                    </>
                                )}
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
                        <Grid item xl={6} lg={6} xs={6} sm={6} md={6}>
                            <SuggestInput
                                data={houses}
                                onSave={setHouse_number}
                                label='Номер дома'
                            />
                        </Grid>
                        <Grid item xl={6} lg={6} xs={6} sm={6} md={6}>
                            <SuggestInput
                                data={corpuses}
                                onSave={setCorpus_number}
                                label='Номер корпуса'
                            />
                        </Grid>
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
                && <Box sx={{
                    mt: '40px',
                    mb: '60px',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column'
                }}>
                    <Typography sx={{fontWeight: 500, fontSize: '1.2rem'}}>
                        Вид отображения результата
                    </Typography>
                    <ButtonGroup sx={{mt: '20px'}}>
                        <Button variant={previousResultView == 'map' ? "outlined" : "contained"} name='map'
                                sx={{width: "200px"}} onClick={onChangeResultView}>Карта</Button>
                        <Button variant={previousResultView == 'table' ? "outlined" : "contained"} name='table'
                                sx={{width: "200px"}} onClick={onChangeResultView}>Таблица</Button>
                    </ButtonGroup>
                </Box>
            }
            {getResultView()}
        </PageWrapper>
    )
}