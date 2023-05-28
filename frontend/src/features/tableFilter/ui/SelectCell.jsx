import {useDeferredValue, useEffect, useMemo, useState} from "react";

import {Checkbox, IconButton, Menu, MenuItem} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert"

import {BaseCell} from "./BaseCell";

// Ячейка таблички для сортировки по уникальным значениям
// Принимает данные, ключ, название ячейки, функцию фильтрации
const SelectCell = ({topic, data, keyName, onFilter, sx, ...props}) => {
    const [selectedOpt, setSelectedOpt] = useState([])
    const deferredSelectedOpt = useDeferredValue(selectedOpt)
    const [anchorEl, setAnchorEl] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // выбираем уникальные опции, игнорируем null
    const options = useMemo(() => {
        const uniqOptions = {}

        data.forEach(el => {
            if (el[keyName] && el[keyName] !== null)
                uniqOptions[el[keyName]] = true
        })

        return Object.keys(uniqOptions)
    }, [data, keyName])

    // если нет уникальных опций - обнуляем выбранные опции
    useEffect(() => {
        if (!options.length && selectedOpt.length)
            setSelectedOpt([])
    }, [options, selectedOpt, setSelectedOpt])

    useEffect(() => {
        onFilter(keyName, deferredSelectedOpt)
    }, [deferredSelectedOpt, keyName, data])

    const onChangeSelectOpt = (option) => {
        // Проверяем есть ли уже такая опция
        const optIndex = selectedOpt.findIndex((selectedOpt) => option == selectedOpt)

        //  Если опция уже есть - удаляем, иначе добавляем
        const newOpt = ~optIndex ? selectedOpt.filter((_, i) => i != optIndex) : [...selectedOpt, option]

        setSelectedOpt(newOpt)
    }

    const onCloseMenu = () => {
        setAnchorEl(null)
        setIsModalOpen(false)
    }

    const onOpenMenu = (e) => {
        setAnchorEl(e.currentTarget)
        setIsModalOpen(true)
    }

    const getFilterIcon = () => {
        return (
            <>
                <IconButton onClick={onOpenMenu} sx={{p: '5px'}}>
                    <MoreVertIcon/>
                </IconButton>
                <Menu
                    onClose={onCloseMenu}
                    anchorEl={anchorEl}
                    open={isModalOpen}
                    PaperProps={{
                        style: {
                            minHeight: '40px',
                            maxHeight: '350px',
                            minWidth: '150px',
                            width: 'max-content'
                        }
                    }}
                >
                    {
                        options.map((option, i) => {
                            const isChecked = !!~selectedOpt.findIndex((selectedOpt) => option == selectedOpt)

                            return (
                                <MenuItem key={i} onClick={() => onChangeSelectOpt(option)}>
                                    <Checkbox
                                        checked={isChecked}
                                        disableRipple
                                        size='small'
                                    />
                                    {option}
                                </MenuItem>
                            )
                        })
                    }
                </Menu>
            </>
        )
    }

    return (
        <BaseCell
            sx={sx}
            topic={topic}
            filterIcon={getFilterIcon()}
            {...props}
        />
    )
}

SelectCell.customFuncName = 'SelectCell'

export {SelectCell}