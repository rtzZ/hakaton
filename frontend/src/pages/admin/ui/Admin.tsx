import * as yup from "yup";
import {useDeferredValue, useEffect, useState} from "react";
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm} from "react-hook-form";

import {Box, Modal} from "@mui/material";

import {TransferList} from "../../../features/transferList";
import {LoadingPage} from "../../../entities/loading";
import {SubmitButton} from "../../../shared/button";
import {PageWrapper} from "../../../features/pageWrapper"
import {PaperLayout} from "../../../shared/layout";
import {SideAlert} from "../../../shared/sideAlert";
import {TextInput} from "../../../features/controlledInput";
import {renameArr} from "../utils/renameArr";
import {learningFieldsToApi, learningFieldsToUI} from "../consts/learningFieldsToUI";
import {LearningStepper} from "./LearningStepper";
import {steps} from "../consts/steps";

import {
    useGetLearnFieldsQuery,
    useLearnModelMutation,
} from "../../../entities/commonStore/api/apiConfigureModel";



const validationSchema = yup.object({name: yup.string().required('Обязательное поле'),})

type FormData = yup.InferType<typeof validationSchema>

const timer = (ms: any) => new Promise(res => setTimeout(res, ms))

// Страница Обучения модели
export const Admin = () => {
    const [activeStep, setActiveStep] = useState<number>(-1)
    const [choosenFields, setChosenFields] = useState<readonly string[]>([]);
    const [errorValidation, setErrorValidation] = useState<string>('')

    const {data: learnFields = [], error: errorGetFields, isLoading: getFieldsLoading} = useGetLearnFieldsQuery() // получение признаков обучения модели
    const [learnFetch, {error: learnError, isLoading: isLoadingLearn, isSuccess: isSuccessLearnFetch}] = useLearnModelMutation() // обучение модели

    const {control, reset, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {name: ''}
    });

    useEffect(() => {
        if (errorValidation) {
            setTimeout(() => setErrorValidation(''), 2000)
        }
    }, [errorValidation])


    useEffect(() => {
        if (learnError) {
            setActiveStep(-1)
        }
    }, [learnError, setActiveStep])

    useEffect(() => { // сброс имени модели
        if (isSuccessLearnFetch) {
            reset()
        }
    }, [isSuccessLearnFetch])

    const  startChangeSteps = async () => {
        const stepsIndex = []

        Object.keys(steps).map((steps, index) => stepsIndex.push(index + 1))
        stepsIndex.push(-1)

        setActiveStep(0)
        for (let step of stepsIndex) {
            await timer(2000)

            if (!learnError) {
                setActiveStep(step)
            }
        }
    }

    const onSubmit = (data: FormData) => {
        if (!choosenFields.length) {
            setErrorValidation('Не выбраны признаки обучения модели')
            return
        }

        startChangeSteps()

        learnFetch({fields: renameArr(learningFieldsToApi, choosenFields), name: data.name})
    }

    if (errorGetFields) {
        // @ts-ignore
        if (errorGetFields?.status === 401) {
            return <PageWrapper>
                <SideAlert severity='error'>Не достаточно прав</SideAlert>
            </PageWrapper>
        }
        return (
            <PageWrapper>
                <SideAlert severity='error'>Не удалось получить признаки для обучения модели</SideAlert>
            </PageWrapper>
        )
    }
    if (getFieldsLoading) {
        return <LoadingPage/>
    }

    return (
        <PageWrapper>
            <PaperLayout>
                {isSuccessLearnFetch && <SideAlert severity='success'>Модель успешно обучена</SideAlert>}
                {errorValidation && <SideAlert severity='error'>{errorValidation}</SideAlert>}
                {learnError && <SideAlert severity='error'>Не удалось обучить модел</SideAlert>}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box>
                        <TextInput
                            errors={errors}
                            control={control}
                            label='Имя модели'
                            name='name'
                        />
                        <TransferList
                            leftHeader='Признаки'
                            rightHeader='Выбранные признаки'
                            subHeaderLeft=''
                            subHeaderRight=''
                            sx={{mt: '20px'}}
                            data={renameArr(learningFieldsToUI, learnFields)}
                            right={choosenFields}
                            setRight={setChosenFields}
                        />
                        <SubmitButton
                            sx={{mt: '20px'}}
                            disabled={isLoadingLearn}>
                            Обучить модель
                        </SubmitButton>
                    </Box>
                </form>
                <LearningStepper
                    error={learnError}
                    activeStep={activeStep}
                />
            </PaperLayout>
        </PageWrapper>
    )
}