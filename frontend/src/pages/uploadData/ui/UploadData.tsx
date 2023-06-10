import {useState} from "react";

import {PageWrapper} from "../../../features/pageWrapper"
import {Button, Step, StepLabel, Stepper} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";

import {useGetStatusUploadQuery, useUploadDataMutation} from "../../../entities/commonStore/api/apiUploadData";
import {PaperLayout} from "../../../shared/layout";
import {SubmitButton} from "../../../shared/button";
import {steps} from "../const/steps";
import {SideAlert} from "../../../shared/sideAlert";
import {ModalLoading} from "../../../entities/loading";

const timer = (ms: any) => new Promise(res => setTimeout(res, ms))

// Страница загрузки данных для модели
export const UploadData = () => {
    const [activeStep, setActiveStep] = useState<number>(-2)
    const [fileAttached, setFileAttached] = useState<boolean>(false)
    const [file, setFile] = useState<any>(null)
    const [fileName, setFileName] = useState<string>('')

    const [uploadFile, {
        error: uploadError,
        isLoading: isLoadingFile
    }] = useUploadDataMutation() // хук для отправки файла

    // const {data: status, isLoading, error} = useGetStatusUploadQuery('', {
    //     pollingInterval: 3000
    // }) // хук для получения статуса отправки файла, пингуется по времени

    // Преобразование прикрепленного файла и его отправка
    const onUploadFile = (files: any) => {

        const file = files[0];
        const formData = new FormData();
        formData.append('file', file)

        setFileName(file?.name || 'Файл прикреплен')
        setFileAttached(true)
        setFile(formData)
    }

    // Получение индекса активного шага для степпера
    // const getActiveStep = () => {
    //     const stage = status?.stage
    //     const step = Object.keys(steps).findIndex(el => el === stage)
    //
    //     return ~step ? step + 1 : -1;
    // }

    const  startChangeSteps = async () => {
        const stepsIndex = []

        Object.keys(steps).map((steps, index) => stepsIndex.push(index + 1))
        stepsIndex.push(-1)

        setActiveStep(0)
        for (let step of stepsIndex) {
            await timer(3000)
            setActiveStep(step)
        }
    }

    // отправка файла
    const sendFile = () => {
        startChangeSteps()
        uploadFile(file)
    }

    return (
        <PageWrapper>
            <PaperLayout>
                {isLoadingFile && <ModalLoading/>}
                {uploadError && <SideAlert severity='error'>Не удалось отправить файл</SideAlert>}
                <Stepper
                    sx={{my: '20px'}}
                    alternativeLabel
                    activeStep={activeStep}
                    >
                    {
                        Object.values(steps).map((step, index) => (
                            <Step key={step}>
                                <StepLabel>
                                    {step}
                                </StepLabel>
                            </Step>
                        ))}
                </Stepper>
                {/*<SubmitButton onClick={sendFile} disabled={isLoadingFile || status?.stage || !fileAttached}>*/}
                {/*    Отправить файл*/}
                {/*</SubmitButton>*/}
                <SubmitButton onClick={sendFile} disabled={isLoadingFile || !fileAttached || (activeStep !==-1 && activeStep !== -2)}>
                    Отправить файл
                </SubmitButton>
                <Button
                    sx={{mt: '20px'}}
                    variant="outlined"
                    component="label"
                    fullWidth
                    color={fileAttached ? 'success' : 'primary'}
                    startIcon={fileAttached ? <CheckIcon/> : <AddIcon/>}
                >
                    {fileAttached ? fileName : 'Загрузить файл'}
                    <input
                        onChange={(e) => onUploadFile(e.target.files)}
                        accept=".zip,.rar,.7zip"
                        type="file"
                        hidden
                    />
                </Button>
            </PaperLayout>
        </PageWrapper>
    )
}