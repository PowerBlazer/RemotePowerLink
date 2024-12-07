import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpCatalogSwitcher.module.scss';
import { Button } from 'shared/ui/Button/Button';
import ArrowIcon from 'shared/assets/icons/arrow-prev.svg';
import sftpStore from 'app/store/sftpStore';
import { useCallback, useState } from 'react';
import { SftpWindowsOptionProps } from 'widgets/SftpModules/SftpCatalog';
import useSftp from "app/hooks/useSftp";

interface SftpCatalogSwitcherProps extends SftpWindowsOptionProps {
    className?: string;
}

export function SftpCatalogSwitcher ({ className, windowsIndex }: SftpCatalogSwitcherProps) {
    const [, updateState] = useState({});
    const forceUpdate = useCallback(() => { updateState({}); }, []);
    const { getHost } = useSftp(windowsIndex);

    const selectedHost = getHost();

    const onClickPrevButtonHandler = async () => {
        const previousPath = selectedHost.sftpFilesOption.historyPrevPaths.pop();

        if (previousPath) {
            selectedHost.sftpFilesOption.historyNextPaths.push(selectedHost.sftpFileList.currentPath);
            selectedHost.isLoad = true;
            await selectedHost.sftpHub.getFilesServer(selectedHost.server.serverId, previousPath);

            forceUpdate();
        }
    }

    const onClickNextButtonHandler = async () => {
        const nextPath = selectedHost.sftpFilesOption.historyNextPaths.pop();

        if (nextPath) {
            selectedHost.sftpFilesOption.historyPrevPaths.push(selectedHost.sftpFileList?.currentPath);
            selectedHost.isLoad = true;
            await selectedHost.sftpHub.getFilesServer(selectedHost.server.serverId, nextPath);

            forceUpdate();
        }
    }

    return (
        <div className={classNames(style.sftpCatalogSwitcher, {}, [className])}>
            <Button
                className={classNames(style.prev_button, {
                    [style.active]: selectedHost.sftpFilesOption.historyPrevPaths.size() > 0
                })}
                onClick={onClickPrevButtonHandler}
            >
                <div className={classNames(style.arrow_icon)}>
                    <ArrowIcon width={20} height={20}/>
                </div>
            </Button>
            <Button
                className={classNames(style.next_button, {
                    [style.active]: selectedHost.sftpFilesOption.historyNextPaths.size() > 0
                })}
                onClick={onClickNextButtonHandler}
            >
                <div className={classNames(style.arrow_icon)}>
                    <ArrowIcon width={20} height={20}/>
                </div>
            </Button>
        </div>
    );
}
