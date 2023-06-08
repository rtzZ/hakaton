import {getApiReqOptions} from "./getApiReqOptions";

const saveData = (function () {
    let downloadEl = document.createElement("a")

    return function (data, blob, fileName) {
        let url = window.URL.createObjectURL(blob)
        downloadEl.href = url
        downloadEl.download = fileName
        downloadEl.click()
        window.URL.revokeObjectURL(url)
    }
}())

export const downloadExcel = async (link, fileName) => {
    try {
        const response = await fetch(link, getApiReqOptions())
        const blob = await response.blob()

        saveData(response.data, blob, fileName)
    } catch (e) {
        console.log(e)
    }
}