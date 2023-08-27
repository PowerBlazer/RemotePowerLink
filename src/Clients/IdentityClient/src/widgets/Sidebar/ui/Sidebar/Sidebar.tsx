/* eslint-disable i18next/no-literal-string */
import { ThemeSwitcher } from 'features/ThemeSwitcher';
import { useState } from 'react';
import { classNames } from 'shared/lib/classNames/classNames';
import { Button } from 'shared/ui/Button/Button';
import { LangSwitcher } from 'widgets/LangSwitcher';
import style from './Sidebar.module.scss';

interface SidebarProps {
    className?: string
}

export function Sidebar ({ className }: SidebarProps) {
    const [collapsed, setCollapsed] = useState<boolean>(false);

    const onToggle = () => {
        setCollapsed(prev => !prev);
    }

    return (
        <div
            className={classNames(style.sidebar, { [style.collapsed]: collapsed }, [className])}
        >
            <Button onClick={onToggle}>Toggle</Button>
            <div className={style.switchers}>
                <ThemeSwitcher />
                <LangSwitcher className={style.lang}/>
            </div>
        </div>
    )
}
