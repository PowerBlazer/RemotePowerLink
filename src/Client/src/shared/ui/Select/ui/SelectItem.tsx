import { classNames } from 'shared/lib/classNames/classNames';
import style from './Select.module.scss';
import { ReactNode, useContext } from 'react';
import { Button } from 'shared/ui/Button/Button';
import { SelectContext, SelectContextProps } from 'shared/lib/Select/SelectContext';
import { SelectedItem } from 'shared/ui/Select';
import ServerIcon from 'shared/assets/icons/navbar/server.svg'

export interface SelectItemProps {
    className?: string;
    icon?: ReactNode,
    selectedItem: SelectedItem,
    isSelected?: boolean
}

export function SelectItem ({ className, selectedItem, isSelected, icon }: SelectItemProps) {
    const {
        setSelected,
        searchValue
    } = useContext<SelectContextProps>(SelectContext);

    const selectItemHandler = () => {
        setSelected(selectedItem);
    }
    
    const isVisible = 
        !searchValue || 
        searchValue === '' || 
        selectedItem.title.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())

    return (
        <Button 
            className={classNames(style.selectItem, { 
                    [style.selected]: isSelected,
                    [style.visible]: isVisible
                }, [className])
            } 
            onClick={selectItemHandler}
        >
            {icon && <div className={classNames(style.icon)}>{icon}</div> }
            <p className={classNames(style.item_title)}>{selectedItem.title}</p>
        </Button>
    );
}
