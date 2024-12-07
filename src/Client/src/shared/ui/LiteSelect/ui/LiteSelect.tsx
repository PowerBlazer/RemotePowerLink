import { classNames } from 'shared/lib/classNames/classNames';
import style from './LiteSelect.module.scss';
import { ReactNode, useState } from 'react';

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
}

export function LiteSelect (props: LiteSelectProps) {
    const {
        className,
        items,
        icon,
        onSelected,
        value = '',
        position = SelectPosition.TOP_LEFT
    } = props

    const [selectedItem, setSelectedItem] = useState<LiteSelectItem>();

    return (
        <div className={classNames(style.liteSelect, {}, [className])}>
            <button className={classNames(style.select_button)}></button>
        </div>
    );
}
