import { classNames } from 'shared/lib/classNames/classNames';
import style from './DefaultServerIcon.module.scss';
import ServerIcon from 'shared/assets/icons/navbar/server2.svg';

interface DefaultServerIconProps {
    className?: string;
    width?: number,
    height?: number
}

export function DefaultServerIcon ({ className, width = 33, height = 33 }: DefaultServerIconProps) {
    return (
        <div
            className={classNames(style.server_block, {}, [className])}
            style={{ width: `${width + 8}px`, height: `${height + 8}px` }}
        >
            <ServerIcon width={width} height={width}/>
        </div>
    );
}
