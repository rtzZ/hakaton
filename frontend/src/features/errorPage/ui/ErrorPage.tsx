import {useLocation, useRouteError} from "react-router-dom";
import {PageWrapper} from "../../pageWrapper";
import {ErrorModal} from "../../../shared/error";

export const ErrorPage = ({error = {}}: any) => {
    const location = useLocation();

    const errorObj = location.pathname.includes('learn-model') && error?.status === 401
        ? {name: 'У вас недостаточно прав'}
        : error

    return (
        <PageWrapper>
            <ErrorModal error={errorObj}/>
        </PageWrapper>
    )
}