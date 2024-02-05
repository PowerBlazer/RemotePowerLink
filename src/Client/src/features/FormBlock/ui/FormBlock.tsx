import { classNames } from 'shared/lib/classNames/classNames';
import style from './FormBlock.module.scss';
import {observer} from "mobx-react-lite";
import {HTMLAttributes} from "react";
import {useTranslation} from "react-i18next";

interface FormBlockProps extends HTMLAttributes<HTMLDivElement>{
    className?: string;
    headerName?: string;
}

function FormBlock (props: FormBlockProps) {
    const {
        className,
        headerName,
        children,
        ...otherProps
    } = props;
    
    const { t } = useTranslation('translation');
    
    return (
        <div 
            className={classNames(style.formBlock, {}, [className])}
            {...otherProps}
        >
            {headerName && <div className={style.header}>
                {t(headerName)}
            </div> }
            <div className={classNames(style.content)}>
                {children}
            </div>
		</div>
    );
}

export default observer(FormBlock);