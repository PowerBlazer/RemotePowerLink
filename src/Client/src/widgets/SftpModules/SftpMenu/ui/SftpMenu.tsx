import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpMenu.module.scss';
import { observer } from 'mobx-react-lite';
import { MenuMode } from 'app/store/sftpStore';
import { useOutsideClick } from 'app/hooks/useOutsideClick';
import { Close, Download, NewFolder, Reconnect, Refresh, Rename, SelectAll, Upload } from 'features/SftpModules/SftpMenuOptions';
import { forwardRef, MutableRefObject, useEffect, useMemo, useState } from 'react';
import { Delete } from 'features/SftpModules/SftpMenuOptions/ui/Delete';
import { SftpWindowsOptionProps } from 'widgets/SftpModules/SftpCatalog';
import { Send } from 'features/SftpModules/SftpMenuOptions/ui/Send';
import useSftp from 'app/hooks/useSftp';

interface SftpMenuProps extends SftpWindowsOptionProps {
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
            windowsIndex,
            isPosition = true,
            isVisible,
            onClose
        } = props;

        const { getHost } = useSftp(windowsIndex);

        const selectedHost = getHost();
        const selectedSftpFileOptions = selectedHost.sftpFilesOption;

        const [isVisibleMenu, setVisibleMenu] = useState<boolean>(isVisible);

        const menuRef = useOutsideClick<HTMLDivElement>(() => {
            onClose?.()

            if (isPosition && selectedHost.menuOption) {
                selectedHost.menuOption.isVisible = false
            }

            setVisibleMenu(false)
        }, [actionButtonRef?.current]);

        let yPx = selectedHost?.menuOption?.y;
        let xPx = selectedHost?.menuOption?.x;

        if (menuRef && selectedHost && selectedHost.menuOption) {
            const sizeY = selectedHost.menuOption.heightWindow - yPx;
            const sizeX = selectedHost.menuOption.widthWindow - xPx;

            if (sizeY < menuRef.current?.clientHeight) {
                yPx = yPx - menuRef.current?.clientHeight - topPaddingMenu
            }

            if (sizeX < menuRef.current?.clientWidth) {
                xPx = xPx - menuRef.current?.clientWidth - leftPaddingMenu
            }
        }

        const onClickCloseMenuHandler = () => {
            setVisibleMenu(false);

            if (isPosition && selectedHost?.menuOption) {
                selectedHost.menuOption.isVisible = false
            }

            onClose?.()
        }

        const defaultModeMenuOptions = useMemo(() => {
            const selectedItemsCount = selectedSftpFileOptions?.fileList?.filter(p => p.isSelected)?.length;

            const isDisabled = !selectedItemsCount || selectedItemsCount === 0;

            return [
                <Rename windowsIndex={windowsIndex} key='Rename' disabled={isDisabled || selectedItemsCount > 1} onClick={onClickCloseMenuHandler}/>,
                <Delete windowsIndex={windowsIndex} key='Delete' disabled={isDisabled} onClick={onClickCloseMenuHandler}/>,
                <Refresh windowsIndex={windowsIndex} key='Refresh' onClick={onClickCloseMenuHandler}/>,
                <NewFolder windowsIndex={windowsIndex} key='NewFolder' disabled={selectedHost.isLoad} onClick={onClickCloseMenuHandler}/>,
                <SelectAll windowsIndex={windowsIndex} key='SelectAll' disabled={selectedHost.isLoad} onClick={onClickCloseMenuHandler}/>,
                <Download windowsIndex={windowsIndex} key='Download' disabled={isDisabled || Boolean(selectedHost?.notificationOptions) || selectedHost.isLoad} onClick={onClickCloseMenuHandler}/>,
                <Upload windowsIndex={windowsIndex} key='Unload' disabled={!selectedHost.sftpFileList || selectedHost.isLoad || Boolean(selectedHost?.notificationOptions)} onClick={onClickCloseMenuHandler}/>,
                <Send windowsIndex={windowsIndex} key='Send' onClick={onClickCloseMenuHandler} disabled={selectedItemsCount === 0 || !selectedHost.sftpFileList || selectedHost.isLoad || Boolean(selectedHost?.notificationOptions)}/>,
                <Reconnect windowsIndex={windowsIndex} key='Reconnect' onClick={onClickCloseMenuHandler} disabled={Boolean(selectedHost?.notificationOptions)}/>,
                <Close windowsIndex={windowsIndex} disabled={Boolean(selectedHost?.notificationOptions)} key='Close' onClick={onClickCloseMenuHandler}/>
            ]
        }, [selectedSftpFileOptions?.fileList, selectedHost?.notificationOptions, selectedHost?.isLoad]);

        const fileModeMenuOptions = useMemo(() => [
            <Rename windowsIndex={windowsIndex} key='Rename' onClick={onClickCloseMenuHandler}/>,
            <Delete windowsIndex={windowsIndex} key='Delete' onClick={onClickCloseMenuHandler}/>,
            <Download windowsIndex={windowsIndex} key='Download' disabled={Boolean(selectedHost?.notificationOptions)} onClick={onClickCloseMenuHandler}/>,
            <Send windowsIndex={windowsIndex} key='Send' onClick={onClickCloseMenuHandler} disabled={Boolean(selectedHost?.notificationOptions)}/>,
            <NewFolder windowsIndex={windowsIndex} key='NewFolder' onClick={onClickCloseMenuHandler}/>,
            <SelectAll windowsIndex={windowsIndex} key='SelectAll' onClick={onClickCloseMenuHandler}/>
        ], [selectedSftpFileOptions?.fileList, selectedHost?.notificationOptions]);

        const folderModeMenuOptions = useMemo(() => [
            <Rename windowsIndex={windowsIndex} key='Rename' onClick={onClickCloseMenuHandler}/>,
            <Delete windowsIndex={windowsIndex} key='Delete' onClick={onClickCloseMenuHandler}/>,
            <Download windowsIndex={windowsIndex} key='Download' disabled={Boolean(selectedHost?.notificationOptions)} onClick={onClickCloseMenuHandler}/>,
            <Send windowsIndex={windowsIndex} key='Send' onClick={onClickCloseMenuHandler} disabled={Boolean(selectedHost?.notificationOptions)}/>,
            <NewFolder windowsIndex={windowsIndex} key='NewFolder' onClick={onClickCloseMenuHandler}/>,
            <SelectAll windowsIndex={windowsIndex} key='SelectAll' onClick={onClickCloseMenuHandler}/>
        ], [selectedSftpFileOptions?.fileList, selectedHost?.notificationOptions]);

        const multitudeModeMenuOptions = useMemo(() => [
            <Rename windowsIndex={windowsIndex} key='Rename' onClick={onClickCloseMenuHandler} disabled={true}/>,
            <Delete windowsIndex={windowsIndex} key='Delete' onClick={onClickCloseMenuHandler}/>,
            <Download windowsIndex={windowsIndex} key='Download' disabled={Boolean(selectedHost?.notificationOptions)} onClick={onClickCloseMenuHandler}/>,
            <NewFolder windowsIndex={windowsIndex} key='NewFolder' onClick={onClickCloseMenuHandler} disabled={true}/>,
            <Send windowsIndex={windowsIndex} key='Send' onClick={onClickCloseMenuHandler} disabled={Boolean(selectedHost?.notificationOptions)}/>,
            <SelectAll windowsIndex={windowsIndex} key='SelectAll' onClick={onClickCloseMenuHandler} disabled={true}/>
        ], [selectedSftpFileOptions?.fileList, selectedHost?.notificationOptions])

        useEffect(() => {
            setVisibleMenu(isVisible)
        }, [isVisible]);

        return (
            <div
                style={{
                    top: yPx && isPosition ? yPx + topPaddingMenu : '',
                    left: xPx && isPosition ? xPx + leftPaddingMenu : ''
                }}
                className={ classNames(style.sftpMenuOptions, { [style.visible]: isVisibleMenu }, [className]) }
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
