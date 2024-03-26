import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpCatalogSwitcher.module.scss';
import { Button } from 'shared/ui/Button/Button';
import ArrowIcon from 'shared/assets/icons/arrow-prev.svg';
import sftpStore from 'app/store/sftpStore';
import { useCallback } from 'react';
import { toJS } from 'mobx';
import { SftpCatalogMode } from 'app/services/SftpService/config/sftpConfig';

interface SftpCatalogSwitcherProps {
    className?: string;
    mode: SftpCatalogMode
}

export function SftpCatalogSwitcher ({ className, mode }: SftpCatalogSwitcherProps) {
    const selectedHost = mode === SftpCatalogMode.First
        ? sftpStore.firstSelectedHost
        : sftpStore.secondSelectedHost;

    const onClickPrevButtonHandler = () => {
        const currentPath = selectedHost.sftpFileList.currentPath;

        selectedHost.sftpFileList = {
            ...selectedHost.sftpFileList,
            prevPath: currentPath
        }

        const newPath = currentPath.substring(0, currentPath.lastIndexOf('/'));

        selectedHost.sftpHub.getFilesServer(selectedHost.server.serverId, newPath)
    }

    const onClockNextButtonHandler = useCallback(() => {
        console.log(selectedHost.sftpFileList.prevPath)
        if (selectedHost.sftpFileList.prevPath) {
            selectedHost.sftpHub.getFilesServer(selectedHost.server.serverId, selectedHost.sftpFileList.prevPath);
        }
    }, [selectedHost.sftpFileList])

    return (
        <div className={classNames(style.sftpCatalogSwitcher, {}, [className])}>
            <Button className={classNames(style.prev_button)} onClick={onClickPrevButtonHandler}>
                <div className={classNames(style.arrow_icon)}>
                    <ArrowIcon width={20} height={20}/>
                </div>
            </Button>
            <Button className={classNames(style.next_button)} onClick={onClockNextButtonHandler}>
                <div className={classNames(style.arrow_icon)}>
                    <ArrowIcon width={20} height={20}/>
                </div>
            </Button>
        </div>
    );
}
