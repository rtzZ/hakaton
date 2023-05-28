export const apiHandleErrorResponse = (response: any) => {
    if (response.status === 'FETCH_ERROR') {
        return {status: 503}
    }

    return response;
}