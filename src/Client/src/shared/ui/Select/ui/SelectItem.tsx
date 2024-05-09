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
        setVisible,
        setSelected
    } = useContext<SelectContextProps>(SelectContext);

    const selectItemHandler = () => {
        setVisible(false);
        setSelected(selectedItem);
    }

    return (
        <Button className={classNames(style.selectItem, { [style.selected]: isSelected }, [className])} onClick={selectItemHandler}>
            {icon ?? <ServerIcon className={classNames(style.server_icon)} width={15} height={15}/>}
            <p className={classNames(style.item_title)}>{selectedItem.title}</p>
        </Button>
    );
}
