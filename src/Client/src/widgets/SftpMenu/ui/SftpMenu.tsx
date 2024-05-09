import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpMenu.module.scss';
import { observer } from 'mobx-react-lite';
import sftpStore, { MenuMode } from 'app/store/sftpStore';
import { useOutsideClick } from 'app/hooks/useOutsideClick';
import { Close, Download, NewFolder, Reconnect, Refresh, Rename, SelectAll, Upload } from 'features/SftpMenuOptions';
import { forwardRef, MutableRefObject, useEffect, useMemo, useState } from 'react';
import { Delete } from 'features/SftpMenuOptions/ui/Delete';
import { SftpCatalogModeProps } from 'widgets/SftpCatalog';
import { Send } from 'features/SftpMenuOptions/ui/Send';

interface SftpMenuProps extends SftpCatalogModeProps {
    className?: string;
    isVisible: boolean,
    isPosition?: boolean,
    onClose?: () => void
}

const topPaddingMenu = 15;
const leftPaddingMenu = 5;

const SftpMenu = forwardRef(
    function SftpMenu (props: SftpMenuProps, actionButtonRef: MutableRefObject<HTMLButtonElement>) {
        const {
            className,
            mode,
            isPosition = true,
            isVisible,
            onClose
        } = props;

        const selectedHost = sftpStore.getSelectedHostInMode(mode);
        const selectedSftpFileOptions = selectedHost.sftpFilesOption;

        const [isVisibleMenu, setVisibleMenu] = useState<boolean>(isVisible);

        const menuRef = useOutsideClick<HTMLDivElement>(() => {
            if (onClose) {
                onClose();
            }

            if (isPosition && selectedHost.menuOption) {
                selectedHost.menuOption.isVisible = false
            }

            setVisibleMenu(false)
        }, [actionButtonRef?.current]);

        let yPx = selectedHost?.menuOption?.y;
        if (menuRef && selectedHost && selectedHost.menuOption) {
            const sizeY = selectedHost.menuOption.heightWindow - yPx;

            if (sizeY < menuRef.current?.clientHeight) {
                yPx = yPx - menuRef.current?.clientHeight - 15
            }
        }

        const onClickCloseMenuHandler = () => {
            setVisibleMenu(false);
            if (isPosition && selectedHost?.menuOption) {
                selectedHost.menuOption.isVisible = false
            }

            if (onClose) {
                onClose();
            }
        }

        const defaultModeMenuOptions = useMemo(() => {
            const selectedItemsCount = selectedSftpFileOptions?.fileList?.filter(p => p.isSelected)?.length;

            const isDisabled = !selectedItemsCount || selectedItemsCount === 0;

            return [
                <Rename mode={mode} key='Rename' disabled={isDisabled || selectedItemsCount > 1} onClick={onClickCloseMenuHandler}/>,
                <Delete mode={mode} key='Delete' disabled={isDisabled} onClick={onClickCloseMenuHandler}/>,
                <Refresh mode={mode} key='Refresh' onClick={onClickCloseMenuHandler}/>,
                <NewFolder mode={mode} key='NewFolder' disabled={selectedHost.isLoad} onClick={onClickCloseMenuHandler}/>,
                <SelectAll mode={mode} key='SelectAll' disabled={selectedHost.isLoad} onClick={onClickCloseMenuHandler}/>,
                <Download mode={mode} key='Download' disabled={isDisabled || Boolean(selectedHost?.notificationOptions) || selectedHost.isLoad} onClick={onClickCloseMenuHandler}/>,
                <Upload mode={mode} key='Unload' disabled={!selectedHost.sftpFileList || selectedHost.isLoad || Boolean(selectedHost?.notificationOptions)} onClick={onClickCloseMenuHandler}/>,
                <Send mode={mode} key='Send' onClick={onClickCloseMenuHandler} disabled={selectedItemsCount === 0 || !selectedHost.sftpFileList || selectedHost.isLoad || Boolean(selectedHost?.notificationOptions)}/>,
                <Reconnect mode={mode} key='Reconnect' onClick={onClickCloseMenuHandler} disabled={Boolean(selectedHost?.notificationOptions)}/>,
                <Close mode={mode} disabled={Boolean(selectedHost?.notificationOptions)} key='Close' onClick={onClickCloseMenuHandler}/>
            ]
        }, [selectedSftpFileOptions?.fileList, selectedHost?.notificationOptions, selectedHost?.isLoad]);

        const fileModeMenuOptions = useMemo(() => [
            <Rename mode={mode} key='Rename' onClick={onClickCloseMenuHandler}/>,
            <Delete mode={mode} key='Delete' onClick={onClickCloseMenuHandler}/>,
            <Download mode={mode} key='Download' disabled={Boolean(selectedHost?.notificationOptions)} onClick={onClickCloseMenuHandler}/>,
            <Send mode={mode} key='Send' onClick={onClickCloseMenuHandler} disabled={Boolean(selectedHost?.notificationOptions)}/>,
            <NewFolder mode={mode} key='NewFolder' onClick={onClickCloseMenuHandler}/>,
            <SelectAll mode={mode} key='SelectAll' onClick={onClickCloseMenuHandler}/>
        ], [selectedSftpFileOptions?.fileList, selectedHost?.notificationOptions]);

        const folderModeMenuOptions = useMemo(() => [
            <Rename mode={mode} key='Rename' onClick={onClickCloseMenuHandler}/>,
            <Delete mode={mode} key='Delete' onClick={onClickCloseMenuHandler}/>,
            <Download mode={mode} key='Download' disabled={Boolean(selectedHost?.notificationOptions)} onClick={onClickCloseMenuHandler}/>,
            <Send mode={mode} key='Send' onClick={onClickCloseMenuHandler} disabled={Boolean(selectedHost?.notificationOptions)}/>,
            <NewFolder mode={mode} key='NewFolder' onClick={onClickCloseMenuHandler}/>,
            <SelectAll mode={mode} key='SelectAll' onClick={onClickCloseMenuHandler}/>
        ], [selectedSftpFileOptions?.fileList, selectedHost?.notificationOptions]);

        const multitudeModeMenuOptions = useMemo(() => [
            <Rename mode={mode} key='Rename' onClick={onClickCloseMenuHandler} disabled={true}/>,
            <Delete mode={mode} key='Delete' onClick={onClickCloseMenuHandler}/>,
            <Download mode={mode} key='Download' disabled={Boolean(selectedHost?.notificationOptions)} onClick={onClickCloseMenuHandler}/>,
            <NewFolder mode={mode} key='NewFolder' onClick={onClickCloseMenuHandler} disabled={true}/>,
            <Send mode={mode} key='Send' onClick={onClickCloseMenuHandler} disabled={Boolean(selectedHost?.notificationOptions)}/>,
            <SelectAll mode={mode} key='SelectAll' onClick={onClickCloseMenuHandler} disabled={true}/>
        ], [selectedSftpFileOptions?.fileList, selectedHost?.notificationOptions])

        useEffect(() => {
            setVisibleMenu(isVisible)
        }, [isVisible]);

        return (
            <div
                style={{
                    top: yPx && isPosition ? yPx + topPaddingMenu : '',
                    left: selectedHost?.menuOption?.x && isPosition ? selectedHost?.menuOption?.x + leftPaddingMenu : ''
                }}
                className={classNames(style.sftpMenuOptions, {
                    [style.visible]: isVisibleMenu
                }, [className])}
                ref={menuRef}
            >
                {selectedHost?.menuOption?.menuMode === MenuMode.Default && defaultModeMenuOptions}
                {selectedHost?.menuOption?.menuMode === MenuMode.File && fileModeMenuOptions}
                {selectedHost?.menuOption?.menuMode === MenuMode.Directory && folderModeMenuOptions}
                {selectedHost?.menuOption?.menuMode === MenuMode.Multitude && multitudeModeMenuOptions}
            </div>
        );
    }
)

export default observer(SftpMenu);
