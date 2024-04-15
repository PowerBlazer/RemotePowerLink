import {classNames} from 'shared/lib/classNames/classNames';
import {ReactNode, useCallback, useEffect, useMemo, useState} from 'react';
import {ModalOptions, ThemeModal, TypeModal} from 'shared/ui/Modal';
import style from './Modal.module.scss';
import {Button, ThemeButton} from "shared/ui/Button/Button";
import CloseIcon from 'shared/assets/icons/close.svg';
import {ButtonLoader} from "shared/ui/ButtonLoader";
import {useTranslation} from "react-i18next";

interface ModalProps {
    className?: string;
    children?: ReactNode;
    theme?: ThemeModal
    options: ModalOptions,
    isVisible?: boolean
}

export function Modal (props: ModalProps) {
    const {
        className,
        theme = ThemeModal.CLEAR,
        isVisible,
        children,
        options
    } = props;

    const [visibleModal, setVisibleModal] = useState<boolean>(true);
    const { t, i18n } = useTranslation('translation')

    const closeModalHandler = useCallback(() => {
        setVisibleModal(false);

        if (options.onCancel) {
            options.onCancel();
        }
    }, [options.onCancel]);

    const confirmModalHandler = useCallback(async () => {
        if (options.onConfirm) {
            await options.onConfirm();
        }

        setVisibleModal(false);
    }, [options.onConfirm]);
    
    
    const closeButton = useMemo(() => (
        <Button className={classNames(style.close_button)} onClick={() => closeModalHandler()}>
            <CloseIcon width={25} height={25}/>
        </Button>
    ),[closeModalHandler])

    const errorModal = [
        <div className={classNames(style.header)} key={'header'}>
            <h1 className={style.header_title}>{t('Ошибка')}</h1>
            {closeButton}
        </div>,
        <div className={classNames(style.content)} key={'content'}>
            {children}
        </div>
    ];

    const formModal = [
        <div className={classNames(style.header)} key={'header'}>
            <h1 className={style.header_title}>{options.headerName}</h1>
            {closeButton}
        </div>,
        <div className={classNames(style.content)} key={'content'}>
            {children}
        </div>,
        <div className={classNames(style.footer)} key={'footer'}>
            <ButtonLoader 
                className={classNames(style.confirm_button)} 
                theme={ThemeButton.PRIMARY}
                actionAsync={confirmModalHandler}
                disabled={options.disabled}
            >
                {t('Подтвердить')}
            </ButtonLoader>
        </div>
    ];

    const informationModal = useMemo(() => (
        <div className={classNames(style.modal_content)}>

        </div>
    ), [options.headerName, theme, i18n.language]);

    useEffect(() => {
        setVisibleModal(isVisible)
    }, [isVisible]);

    return (
        <div
            className={classNames(style.modal_window, {
                [style.active]: visibleModal,
                [style.dark]: theme === ThemeModal.DARK,
                [style.clear]: theme === ThemeModal.CLEAR,
                [style.error]: options.type === TypeModal.ERROR
            }, [className])}
        >
            <div className={classNames(style.modal_content)}>
                {options.type === TypeModal.DEFAULT && informationModal}
                {options.type === TypeModal.ERROR && errorModal}
                {options.type === TypeModal.FORM && formModal}
            </div>
        </div>
    );
}
