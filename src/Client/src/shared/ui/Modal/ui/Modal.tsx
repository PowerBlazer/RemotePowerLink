import { classNames } from 'shared/lib/classNames/classNames';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { ThemeModal, TypeModal, ModalOptions } from 'shared/ui/Modal';
import style from './Modal.module.scss';

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

    const closeModalHandler = useCallback(() => {
        setVisibleModal(false);

        if (options.onCancel) {
            options.onCancel();
        }
    }, [options.onCancel]);

    const confirmModalHandler = useCallback(() => {
        setVisibleModal(false);

        if (options.onConfirm) {
            options.onConfirm();
        }
    }, [options.onConfirm]);

    const errorModal = useMemo(() => (
        <div className={classNames(style.modal_content)}>

        </div>
    ), [theme]);

    const formModal = useMemo(() => (
        <div className={classNames(style.modal_content)}>

        </div>
    ), [options.headerName, theme]);

    const informationModal = useMemo(() => (
        <div className={classNames(style.modal_content)}>

        </div>
    ), [options.headerName, theme]);

    useEffect(() => {
        setVisibleModal(isVisible)
    }, [isVisible]);

    return (
        <div
            className={classNames(style.modal_window, {
                [style.active]: visibleModal
            }, [className])}
        >
            {options.type === TypeModal.DEFAULT && informationModal}
            {options.type === TypeModal.ERROR && errorModal}
            {options.type === TypeModal.FORM && formModal}
        </div>
    );
}
