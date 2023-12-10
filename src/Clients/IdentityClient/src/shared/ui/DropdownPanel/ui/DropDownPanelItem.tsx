import { ReactNode, useContext } from 'react';
import { DropdownPanelContext } from '../types/DropDownPanelContext';
import style from './assets/DropDownPanelItem.module.scss'
import { useTheme } from 'app/providers/ThemeProvider';
import { classNames } from 'shared/lib/classNames/classNames';
import { Theme } from 'shared/lib/Theme/ThemeContext';

interface IDropDownPanelItemProps {
    icon?: string,
    text?: string,
    textColor?: string,
    onClick?: () => void,
    children?: ReactNode
}

function DropDownPanelItem ({ icon, text, textColor, onClick, children }: IDropDownPanelItemProps) {
    const { setDropDownPanelVisible } = useContext(DropdownPanelContext);
    const { theme } = useTheme();

    const clickHandler = () => {
        setDropDownPanelVisible(false);
        onClick?.();
    }

    return (
        <button type="button" onClick={clickHandler} className={classNames(style.dropDownPanel_item,
            { [style.clear]: theme === Theme.LIGHT, [style.dark]: theme !== Theme.DARK })}>
            <div className={style.dropDownPanel_item_inner}>
                {icon && <img src={icon} alt="menu" width={18} height={18}></img>}
                {children}
                {text && <span className={style.text} style={{ color: textColor }}>{text}</span>}
            </div>
        </button>
    )
}

export default DropDownPanelItem
