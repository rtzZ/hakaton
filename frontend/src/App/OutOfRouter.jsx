import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

import {ErrorPage} from "../features/errorPage";

// Компонент обработки по переходу несуществующего пути
export const OutOfRouter = () => {
    const navigate = useNavigate()

    useEffect(() => {
        navigate('/recommendation')
    }, [])

    return (
        <ErrorPage/>
    )
}