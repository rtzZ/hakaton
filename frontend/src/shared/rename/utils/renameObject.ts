export const renameObject = (new_names: any, originObject: any) => {
    const res: any = {}

    Object.keys(new_names).forEach(new_key => {
        if (new_key in originObject) {
            res[new_names[new_key]] = originObject[new_key]
        }
    })

    return res
}