export const renameArr = (new_names, originArr) => {
    const res = []

    Object.keys(new_names).forEach(new_key => {
        if (originArr.some(el => el === new_key)) {
            res.push(new_names[new_key])
        }
    })

    return res
}