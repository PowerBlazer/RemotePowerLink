import { classNames } from 'shared/lib/classNames/classNames';
import { Children, ReactElement, ReactNode, useEffect, useRef, useState } from 'react';
import { SelectItemProps } from 'shared/ui/Select/ui/SelectItem';
import { SelectContext } from 'shared/lib/Select/SelectContext';
import { useOutsideClick } from 'app/hooks/useOutsideClick';
import { Button } from 'shared/ui/Button/Button';
import { ErrorLabel } from 'shared/ui/ErrorLabel';
import style from './Select.module.scss';
import ArrowCircleIcon from 'shared/assets/icons/arrow-circle-up.svg';
import CloseIcon from 'shared/assets/icons/close.svg';
import { useTranslation } from 'react-i18next';

export enum ThemeSelect {
    CLEAR = 'clear',
    DARK = 'dark'
}

interface SelectProps {
    className?: string;
    children?: ReactElement<SelectItemProps> | Array<ReactElement<SelectItemProps>>;
    theme?: ThemeSelect
    selectedItem?: SelectedItem,
    placeholder: string,
    icon?: ReactNode,
    errors?: string[],
    onChange?: (selectedItem?: SelectedItem) => void
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
        icon
    } = props;

    const [visible, setVisible] = useState<boolean>(false);
    const [selectedElement, setSelected] = useState<SelectedItem | undefined>(selectedItem);
    const { t } = useTranslation('translation');
    const refOptions = useRef<HTMLDivElement>(null);

    const refSelect = useOutsideClick<HTMLButtonElement>(() => {
        setVisible(false);
    }, refOptions?.current ? [refOptions?.current] : null);

    const isChildren = children && Children.count(children) > 0;

    const defaultValueContext = {
        visible,
        setVisible,
        selectedItem,
        setSelected
    }

    const selectButtonHandler = () => {
        setVisible(value => !value);
    }

    const canselSelectedItemHandler = () => {
        setSelected(undefined);
        setVisible(false);

        if (onChange) {
            onChange(undefined)
        }
    }

    useEffect(() => {
        if (onChange && selectedElement) {
            onChange(selectedElement);
        }
    }, [selectedElement]);

    return (
        <SelectContext.Provider value={defaultValueContext}>
            <div className={classNames(style.select_inner)}>
                <div className={classNames(style.select_block, {
                    [style.active]: visible,
                    [style.selected]: Boolean(selectedItem || selectedElement)
                }, [])}>
                    <button
                        className={classNames(style.select, {
                            [style.error]: Boolean(errors)
                        }, [className])}
                        onClick={selectButtonHandler}
                        ref={refSelect}
                    >
                        <div className={classNames(style.select_header)}>
                            <div className={classNames(style.header_content)}>
                                <div className={classNames(style.header_icon)}>
                                    {icon}
                                </div>
                                { selectedItem
                                    ? selectedItem.title
                                    : (selectedElement ? selectedElement.title : placeholder)
                                }
                            </div>
                            <div className={classNames(style.common)}>
                                <div className={classNames(style.select_icon)}>
                                    <ArrowCircleIcon width={20} height={20}/>
                                </div>
                            </div>
                        </div>
                    </button>
                    <div className={classNames(style.select_options, { [style.empty_options]: !isChildren })} ref={refOptions}>
                        {isChildren ? children : <p className={classNames(style.select_null)}>{t('Отсутсвует данные')}</p>}
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
