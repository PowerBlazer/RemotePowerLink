import { classNames } from 'shared/lib/classNames/classNames';
import style from './LiteSelect.module.scss';
import { ReactNode, useState } from 'react';
import { Button } from 'shared/ui/Button/Button';

export enum SelectPosition {
    TOP_LEFT,
    BOTTOM_LEFT,
    TOP_RIGHT,
    BOTTOM_RIGHT,
}

export interface LiteSelectItem {
    id: string;
    text: string;
}

interface LiteSelectProps {
    className?: string;
    items?: LiteSelectItem[];
    icon?: ReactNode;
    onSelected?: (selectedItem: LiteSelectItem) => void;
    value?: string;
    position?: SelectPosition;
    title?: string;
}

export function LiteSelect (props: LiteSelectProps) {
    const {
        className,
        items,
        icon,
        onSelected,
        value = '',
        title,
        position = SelectPosition.TOP_LEFT
    } = props

    const [selectedItem, setSelectedItem] = useState<LiteSelectItem>();
    const [visible, setVisible] = useState<boolean>(true);

    return (
        <div className={classNames(style.liteSelect, {}, [className])}>
            <Button className={classNames(style.select_button)} title={title}>{icon}</Button>
            <div
                className={classNames(style.select_list, {
                    [style.visible]: visible
                })}
            >
                {items.map((item) =>
                    <Button key={item.id} className={classNames(style.select_item)}>{item.text}</Button>
                )}
            </div>
        </div>
    );
}
