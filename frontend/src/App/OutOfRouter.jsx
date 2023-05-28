import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

import {ErrorPage} from "../features/errorPage";

export const OutOfRouter = () => {
    const navigate = useNavigate()

    useEffect(() => {
        navigate('/recommendation')
    }, [])

    return (
        <ErrorPage/>
    )
}