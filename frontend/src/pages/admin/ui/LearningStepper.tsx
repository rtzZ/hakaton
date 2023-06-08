import {useEffect, useState} from "react";

import {Step, Stepper, StepLabel} from "@mui/material";

import {steps} from "../consts/steps";

interface ILearningStepper {
    error?: object
    activeStep: number
}
export const LearningStepper = ({error, activeStep}: ILearningStepper) => {
    return (
        <Stepper
            sx={{mt: '60px'}}
            alternativeLabel
            activeStep={activeStep}>
            {
                Object.values(steps).map((step, index) => (
                    <Step key={step}>
                        <StepLabel>
                            {step}
                        </StepLabel>
                    </Step>
                ))}
        </Stepper>
    )
}
