﻿import { classNames } from 'shared/lib/classNames/classNames';
import style from './SearchInput.module.scss';
import SearchIcon from "shared/assets/icons/search.svg";
import {useTranslation} from "react-i18next";

interface FilterInputProps {
    className?: string;
    onChange?: (value: string) => void
}

export function SearchInput ({ className, onChange }: FilterInputProps) {
    const { t, i18n } = useTranslation('translation');
    
    return (
        <div className={classNames(style.search_content,{},[className])}>
            <div className={classNames(style.search_icon)}>
                <SearchIcon width={17} height={17}/>
            </div>
            <input
                type="text"
                className={classNames(style.search_input)}
                placeholder={t("Поиск")}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}