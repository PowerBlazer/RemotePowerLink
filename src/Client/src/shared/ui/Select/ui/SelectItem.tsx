import { classNames } from 'shared/lib/classNames/classNames';
import style from './Select.module.scss';
import {ReactNode, useContext} from "react";
import {Button} from "shared/ui/Button/Button";
import {SelectContext, SelectContextProps} from "shared/lib/Select/SelectContext";
import {SelectedItem} from "shared/ui/Select";

export interface SelectItemProps {
    className?: string;
    icon?:ReactNode,
    selectedItem: SelectedItem
}

export function SelectItem ({ className,selectedItem }: SelectItemProps) {
    const {
        setVisible
    } = useContext<SelectContextProps>(SelectContext);
    
    
    const selectItemHandler = () => {
        setVisible(false);
    }
    
    return (
        <Button className={classNames(style.SelectItem, {}, [className])} onClick={selectItemHandler}>
            {selectedItem.title}
		</Button>
    );
}