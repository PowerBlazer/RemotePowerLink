import { classNames } from 'shared/lib/classNames/classNames';
import LogoIcon from 'shared/assets/icons/logo.svg';
import style from './Logotype.module.scss';
import { useTheme } from 'shared/lib/Theme/useTheme';

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
    const { theme } = useTheme();

    return (
        <div className={classNames(style.logotype, {}, [className])}>
            <LogoIcon width={width} height={height}/>
            {isText && <h1 style={{ fontSize: `${fontSize}px` }}>RemotePowerline</h1>}
        </div>
    );
}
