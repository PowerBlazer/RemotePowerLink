import { classNames } from 'shared/lib/classNames/classNames';
import { Children, ReactElement, ReactNode, useRef, useState } from 'react';
import { SelectItemProps } from 'shared/ui/Select/ui/SelectItem';
import {SelectContext, SelectContextProps} from 'shared/lib/Select/SelectContext';
import { useOutsideClick } from 'app/hooks/useOutsideClick';
import { Button } from 'shared/ui/Button/Button';
import { ErrorLabel } from 'shared/ui/ErrorLabel';
import style from './Select.module.scss';
import CloseIcon from 'shared/assets/icons/close.svg';
import { useTranslation } from 'react-i18next';
import {SearchInput} from "features/SearchInput";

export enum ThemeSelect {
    CLEAR = 'clear',
    DARK = 'dark'
}

export enum SelectPosition{
    LEFT_TOP,
    RIGHT_TOP,
    LEFT_BOTTOM,
    RIGHT_BOTTOM,
}

interface SelectProps {
    width?: number,
    height?: number,
    widthOptionsPanel?: number,
    className?: string;
    children?: ReactElement<SelectItemProps> | Array<ReactElement<SelectItemProps>>;
    theme?: ThemeSelect
    selectedItem?: SelectedItem,
    placeholder?: string,
    icon?: ReactNode,
    errors?: string[],
    onChange?: (selectedItem?: SelectedItem) => void,
    isSearchable?: boolean,
    position?: SelectPosition,
    isLite?: boolean,
}

export interface SelectedItem {
    id: string,
    title: string
}

export function Select (props: SelectProps) {
    const {
        className,
        children,
        selectedItem,
        placeholder,
        errors,
        onChange,
        icon,
        position = SelectPosition.LEFT_BOTTOM,
        isSearchable,
        isLite = false,
        width,
        widthOptionsPanel,
        height
    } = props;

    const [visible, setVisible] = useState<boolean>(false);
    const [selectedElement, setSelected] = useState<SelectedItem | undefined>(selectedItem);
    const [searchValue, setSearchValue] = useState<string>(null);

    const { t } = useTranslation('translation');
    const refOptions = useRef<HTMLDivElement>(null);

    const refSelect = useOutsideClick<HTMLButtonElement>(() => {
        setVisible(false);
    }, refOptions?.current ? [refOptions?.current] : null);

    const isChildren = children && Children.count(children) > 0;
    
    const canselSelectedItemHandler = () => {
        setSelected(undefined);
        setVisible(false);

        if (onChange) {
            onChange()
        }
    }
    
    const onChangeSearchInput = (value:string) => {
        setSearchValue(value)
    }
    
    const onChangeSelectHandler = (selectedItem: SelectedItem) => {
        setSelected(selectedItem);
        setVisible(false);
        
        if(onChange)
            onChange(selectedItem);
    }

    const defaultValueContext: SelectContextProps = {
        visible,
        selectedElement: selectedItem,
        setSelected: onChangeSelectHandler,
        searchValue
    }
    
    return (
        <SelectContext.Provider value={defaultValueContext}>
            <div className={classNames(style.select_inner, {[style.lite]: Boolean(isLite)})}>
                <div className={classNames(style.select_block, {
                    [style.active]: visible,
                    [style.selected]: Boolean(selectedItem || selectedElement)
                }, [])}>
                    <button
                        className={classNames(style.select, {
                            [style.error]: Boolean(errors),
                        }, [className])}
                        onClick={() => setVisible(value => !value) }
                        ref={refSelect}
                        style={{
                            width: width ? `${width}px` : '100%', 
                            height: height ? `${height}px` : 'auto',
                        }}
                    >
                        <div className={classNames(style.select_header)}>
                            <div className={classNames(style.header_content)}>
                                { icon && 
                                    <div className={classNames(style.header_icon)}>
                                        {icon}
                                    </div>
                                }
                                <div className={classNames(style.title)}>
                                    { selectedItem
                                        ? selectedItem.title
                                        : (selectedElement ? selectedElement.title : (placeholder ?? ''))
                                    }
                                </div>
                                
                            </div>
                        </div>
                    </button>
                    <div 
                        className={classNames(style.select_options, {
                            [style.left_bottom]: position === SelectPosition.LEFT_BOTTOM,
                            [style.left_top]: position === SelectPosition.LEFT_TOP,
                            [style.right_bottom]: position === SelectPosition.RIGHT_BOTTOM,
                            [style.right_top]: position === SelectPosition.RIGHT_TOP
                        })}
                        style={{
                            width: widthOptionsPanel ? `${widthOptionsPanel}px` : '100%',
                        }}
                        ref={refOptions}
                    >
                        {isSearchable && 
                            <div className={classNames(style.search_item)}>
                                <SearchInput className={classNames(style.search_input)} onChange={onChangeSearchInput}/>
                            </div> 
                        }
                        <div className={classNames(style.select_options_inner, { [style.empty_options]: !isChildren })}>
                            {isChildren ? children : <p className={classNames(style.select_null)}>{t('Отсутствуют данные')}</p>}
                        </div>
                    </div>
                    {
                        (selectedItem || selectedElement) &&
                        <Button
                            className={classNames(style.cancel)}
                            onClick={canselSelectedItemHandler}
                        >
                            <CloseIcon width={20} height={20}/>
                        </Button>
                    }
                </div>
                {errors && <ErrorLabel errors={errors} className={classNames(style.error_label)}/>}
            </div>
        </SelectContext.Provider>
    );
}
