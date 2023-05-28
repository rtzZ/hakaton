import {useState, useEffect} from "react";

import {PageWrapper} from "../../../features/pageWrapper"
import {Button, Grid, Step, StepLabel, Stepper} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";

import {useGetStatusUploadQuery, useUploadDataMutation} from "../../../entities/commonStore/api/apiUploadData";
import {PaperLayout} from "../../../shared/layout";
import {SubmitButton} from "../../../shared/button";
import {steps} from "../const/steps";
import {SideAlert} from "../../../shared/sideAlert";
import {ModalLoading} from "../../../entities/loading";

// Страница загрузки данных для модели
export const UploadData = () => {
    const [fileAttached, setFileAttached] = useState<boolean>(false)
    const [file, setFile] = useState<any>(null)
    const [fileName, setFileName] = useState<string>('')

    const [uploadFile, {
        error: uploadError,
        isLoading: isLoadingFile
    }] = useUploadDataMutation() // хук для отправки файла

    const {data: status, isLoading, error} = useGetStatusUploadQuery('', {
        pollingInterval: 3000
    }) // хук для получения статуса отправки файла, пингуется по времени

    // Преобразование прикрепленного файла и его отправка
    const onUploadFile = (files: any) => {

        const file = files[0];
        const formData = new FormData();
        formData.append('file', file)

        setFileName(file.name)
        setFileAttached(true)
        setFile(formData)
    }

    // Получение индекса активного шага для степпера
    const getActiveStep = () => {
        const stage = status?.stage
        const step = Object.keys(steps).findIndex(el => el === stage)

        return ~step ? step + 1 : -1;
    }

    // отправка файла
    const sendFile = () => {
        uploadFile(file)
    }

    return (
        <PageWrapper>
            <PaperLayout>
                {isLoadingFile && <ModalLoading/>}
                {uploadError && <SideAlert severity='error'>Не удалось отправить файл</SideAlert>}
                <Button
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
                <SubmitButton sx={{mt: '20px'}} onClick={sendFile} disabled={isLoadingFile || status?.stage || !fileAttached}>
                    Отправить файл
                </SubmitButton>
                <Stepper
                    sx={{mt: '60px'}}
                    alternativeLabel
                    activeStep={getActiveStep()}>
                    {
                        Object.values(steps).map((step, index) => (
                            <Step key={step}>
                                <StepLabel>
                                    {step}
                                </StepLabel>
                            </Step>
                        ))}
                </Stepper>
            </PaperLayout>
        </PageWrapper>
    )
}