import React from 'react'

interface IDropDownPanelContext {
    setDropDownPanelVisible?: React.Dispatch<React.SetStateAction<boolean>>
}

export const DropdownPanelContext = React.createContext<IDropDownPanelContext>({})
