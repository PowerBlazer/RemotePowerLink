import { classNames } from 'shared/lib/classNames/classNames';
import style from './NavbarBasic.module.scss';
import { ThemeSwitcher } from 'features/ThemeSwitcher';
import { LangSwitcher } from 'features/LangSwitcher';

interface NavbarBasicProps {
    className?: string;
}

export function NavbarBasic ({ className }: NavbarBasicProps) {
    return (
        <div className={classNames(style.navbar, {}, [className])}>
            <ThemeSwitcher />
            <LangSwitcher/>
        </div>
    );
}
