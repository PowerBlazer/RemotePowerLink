import { classNames } from 'shared/lib/classNames/classNames';
import './Loader.scss';
import {ButtonHTMLAttributes} from "react";

interface LoaderProps extends ButtonHTMLAttributes<HTMLDivElement>{
    className?: string;
}

export function Loader ({ className, ...otherProps }: LoaderProps) {
    return (
        <div 
            className={classNames('lds-dual-ring', {}, [className])}
            {...otherProps}
        ></div>
    );
}
