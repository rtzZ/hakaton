export const getApiReqOptions = () => {
    return {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        extraOptions: {
            credentials: "include"
        }
    }
}