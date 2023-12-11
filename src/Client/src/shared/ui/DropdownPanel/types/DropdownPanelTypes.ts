import React, { ButtonHTMLAttributes } from 'react'

export interface IDropDownPanelConfig {
    position: DropDownPanelPosition
    isOpacity?: boolean,
    backgroundColor?: string,
    width?: string,
    isLeave?: boolean,
    theme?: ThemeDropDownPanel
}

export interface IDropDownPanelButtonConfig extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: React.ReactNode
    active: boolean,
}

export enum DropDownPanelPosition {
    left,
    right,
    topLeft,
    topRight,
    bottomLeft,
    bottomRight
}

export enum ThemeDropDownPanel {
    CLEAR = 'clear',
    DARK = 'dark'
}
