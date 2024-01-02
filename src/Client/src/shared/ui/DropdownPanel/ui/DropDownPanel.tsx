import clsx from 'clsx'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { IDropDownPanelButtonConfig, IDropDownPanelConfig, DropDownPanelPosition } from '../types/DropdownPanelTypes';
import DropDownPanelButton from './DropDownButton';
import { classNames } from 'shared/lib/classNames/classNames';
import { DropdownPanelContext } from 'shared/lib/DropdownPanel/DropDownPanelContext';
import { useOutsideClickComponent } from 'shared/lib/DropdownPanel/useOutsideClickComponent'
import style from './assets/DropDownPanel.module.scss';

interface IDropDownPanelProps {
    children?: React.ReactNode
    dropDownPanelConfig: IDropDownPanelConfig
    buttonMenuConfig: IDropDownPanelButtonConfig
}

function DropDownPanel ({ children, dropDownPanelConfig, buttonMenuConfig }: IDropDownPanelProps) {
    const [dropDownPanelVisible, setDropDownPanelVisible] = useState<boolean>(false);

    const menuRef = useRef(null);

    useOutsideClickComponent(menuRef, () => {
        setDropDownPanelVisible(false);
    })

    buttonMenuConfig.onClick = () => {
        setDropDownPanelVisible(!dropDownPanelVisible);
    }

    buttonMenuConfig.active = dropDownPanelVisible;

    const mouseLeaveHandler = useCallback(() => {
        setTimeout(() => {
            if (dropDownPanelConfig.isLeave) {
                setDropDownPanelVisible(false);
            }
        }, 170);
    }, [])

    const position = useMemo(() => (clsx({
        [style.right]: dropDownPanelConfig.position === DropDownPanelPosition.right,
        [style.left]: dropDownPanelConfig.position === DropDownPanelPosition.left,
        [style.top_left]: dropDownPanelConfig.position === DropDownPanelPosition.topLeft,
        [style.top_right]: dropDownPanelConfig.position === DropDownPanelPosition.topRight,
        [style.bottom_left]: dropDownPanelConfig.position === DropDownPanelPosition.bottomLeft,
        [style.botton_right]: dropDownPanelConfig.position === DropDownPanelPosition.bottomRight
    })), [dropDownPanelConfig]);

    return (
        <div className={classNames(style.dropDownPanel, {})} ref={menuRef}>
            <DropDownPanelButton config={buttonMenuConfig}/>
            <div 
                 onMouseLeave={mouseLeaveHandler} 
                 className={classNames(style.dropDownPanel_items, {
                    [style.open]: dropDownPanelVisible,
                    [style.close]: !dropDownPanelVisible
                 }, [position, style[dropDownPanelConfig.theme]])} 
                 style={{ width: dropDownPanelConfig.width, top: buttonMenuConfig.style?.height && Number(buttonMenuConfig.style.height) + 15 }}>
                <DropdownPanelContext.Provider value={{ setDropDownPanelVisible }}>
                    {children}
                </DropdownPanelContext.Provider>
            </div>
        </div>
    )
}

export default DropDownPanel
