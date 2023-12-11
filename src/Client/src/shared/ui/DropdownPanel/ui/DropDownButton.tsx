import { ButtonHTMLAttributes } from 'react'
import { IDropDownPanelButtonConfig } from '../types/DropdownPanelTypes'
import style from './assets/DropDownPanelButton.module.scss'
import { classNames } from 'shared/lib/classNames/classNames'

interface IDropDownPanelButton {
    config: IDropDownPanelButtonConfig
}

function DropDownPanelButton ({ config }: IDropDownPanelButton) {
    return (
        <button className={classNames(style.dropDownPanel_button, { [style.active_button]: config.active })}
            onClick={config.onClick} {...config} type="button">
            {config.icon && config.icon}
            {config.children}
        </button>
    )
}

export default DropDownPanelButton
