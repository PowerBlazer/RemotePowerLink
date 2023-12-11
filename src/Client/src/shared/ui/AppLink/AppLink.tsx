import { Link, type LinkProps } from 'react-router-dom'
import { classNames } from '../../lib/classNames/classNames'
import style from './AppLink.module.scss'

export enum AppLinkTheme {
    PRIMARY = 'primary',
    SECONDARY = 'secondary'

}

interface AppLinkProps extends LinkProps {
    className?: string
    theme?: AppLinkTheme
}

export function AppLink (props: AppLinkProps) {
    const {
        to,
        className,
        children,
        theme = AppLinkTheme.PRIMARY,
        ...otherProps
    } = props

    return (
        <Link
            to={to}
            className={classNames(style.appLink, {}, [className, style[theme]])}
            {...otherProps}
        >
            {children}
        </Link>
    )
}
