import { classNames } from 'shared/lib/classNames/classNames';
import style from './Select.module.scss';
import {ReactElement, ReactNode, useRef, useState} from "react";
import { SelectItemProps } from "shared/ui/Select/ui/SelectItem";
import ArrowCircleIcon from 'shared/assets/icons/arrow-circle-up.svg';
import {Button} from "shared/ui/Button/Button";
import {SelectContext} from "shared/lib/Select/SelectContext";
import {useOutsideClick} from "app/hooks/useOutsideClick";


export enum ThemeSelect {
    CLEAR = 'clear',
    DARK = 'dark'
}

interface SelectProps {
    className?: string;
    children?:  ReactElement<SelectItemProps> | ReactElement<SelectItemProps>[];
    theme?: ThemeSelect
    selectedItem?: SelectedItem,
    placeholder: string,
    icon?: ReactNode
    onChange?: (selectedItem: SelectedItem) => void
}

export interface SelectedItem{
    id:string,
    title: string
}
    
export function Select ({ className, children, selectedItem, placeholder, theme, icon }: SelectProps) {
    const [visible, setVisible] = useState<boolean>(false);
    const [selectedElement, setSelected] = useState<SelectedItem>(selectedItem);

    const refOptions = useRef<HTMLDivElement>(null);
    const refSelect = useOutsideClick<HTMLButtonElement>(() => {
        setVisible(false);
    },[refOptions?.current]);
    
    const defaultValueContext = {
        visible,
        setVisible,
        selectedItem,
        setSelected
    }
    
    const selectButtonHandler = () => {
        setVisible(value=> !value);
    }
    
    return (
        <SelectContext.Provider value={defaultValueContext}>
            <div className={classNames(style.select_block, {[style.active]: visible},[])}>
                <button
                    className={classNames(style.select, {}, [className])}
                    onClick={selectButtonHandler}
                    ref={refSelect}
                >
                    <div className={classNames(style.select_header)}>
                        <div className={classNames(style.header_content)}>
                            <div className={classNames(style.header_icon)}>
                                {icon}
                            </div>
                            {selectedElement ? selectedElement.title : placeholder}
                        </div>
                        <div className={classNames(style.select_icon)}>
                            <ArrowCircleIcon width={20} height={20}/>
                        </div>
                    </div>
                </button>
                <div className={classNames(style.select_options)} ref={refOptions}>
                    {children}
                </div>
            </div>
        </SelectContext.Provider>
    );
}