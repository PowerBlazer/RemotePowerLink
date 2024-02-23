import { classNames } from 'shared/lib/classNames/classNames';
import style from './Select.module.scss';
import {Children, ReactElement, ReactNode, useEffect, useRef, useState} from "react";
import { SelectItemProps } from "shared/ui/Select/ui/SelectItem";
import ArrowCircleIcon from 'shared/assets/icons/arrow-circle-up.svg';
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
    
export function Select ({ 
    className, 
    children, 
    selectedItem, 
    placeholder, 
    theme, 
    onChange,
    icon 
}: SelectProps) {
    
    const [visible, setVisible] = useState<boolean>(false);
    const [selectedElement, setSelected] = useState<SelectedItem>(selectedItem);

    const isChildren = children && Children.count(children) > 0;
    
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

    useEffect(() => {
        if (onChange && selectedElement) {
            onChange(selectedElement);
        }
    }, [selectedElement]);
    
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
                <div className={classNames(style.select_options,{[style.empty_options]: !isChildren})} ref={refOptions}>
                    {isChildren ? children : <p className={classNames(style.select_null)}>Отсутсвует данные</p>}
                </div>
            </div>
        </SelectContext.Provider>
    );
}