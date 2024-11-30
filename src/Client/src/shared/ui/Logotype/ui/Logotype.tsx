/* eslint-disable i18next/no-literal-string */
import { classNames } from 'shared/lib/classNames/classNames';
import LogoIcon from 'shared/assets/icons/logo.svg';
import style from './Logotype.module.scss';
import { useTheme } from 'shared/lib/Theme/useTheme';
import { useTranslation } from 'react-i18next';

interface LogotypeProps {
    className?: string;
    width?: number;
    height?: number;
    isText?: boolean;
    fontSize?: number;
}

export function Logotype ({
    className,
    width = 60,
    height = 60,
    isText = true,
    fontSize = 30
}: LogotypeProps) {
    const { t } = useTranslation('translation');

    return (
        <div className={classNames(style.logotype, {}, [className])}>
            <LogoIcon width={width} height={height}/>
            {isText && <h1 style={{ fontSize: `${fontSize}px` }}>RemotePowerlink</h1>}
        </div>
    );
}
