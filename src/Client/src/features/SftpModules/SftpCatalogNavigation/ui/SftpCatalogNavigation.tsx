import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpCatalogNavigation.module.scss';
import { observer } from 'mobx-react-lite';
import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import sftpStore from 'app/store/sftpStore';
import { Button } from 'shared/ui/Button/Button';
import FolderIcon from 'shared/assets/icons/sftp/folder.svg';
import ArrowIcon from 'shared/assets/icons/arrow-prev.svg'
import { SftpWindowsOptionProps } from 'widgets/SftpModules/SftpCatalog';
import useSftp from 'app/hooks/useSftp';

interface SftpCatalogNavigationProps extends SftpWindowsOptionProps {
    className?: string;
}

interface NavigationItem {
    name: string,
    path: string
}

function SftpCatalogNavigation ({ className, windowsIndex }: SftpCatalogNavigationProps) {
    const { getHost } = useSftp(windowsIndex);
    const selectedHost = getHost();

    const inputRef = useRef<HTMLInputElement>(null);
    const [isActiveInput, setActiveInput] = useState<boolean>(false);
    const [lastVisibleCount, setVisibleCount] = useState<number>(3);

    const [editPathValue, setPathValue] = useState<string>(
        selectedHost?.sftpFileList ? selectedHost.sftpFileList.currentPath : ''
    );

    const listDirectories = useMemo<NavigationItem[]>(() => {
        const folders = selectedHost.sftpFileList?.currentPath
            .split('/')
            .filter(folder => folder.trim() !== '');

        if (selectedHost.sftpFileList?.currentPath === '/') {
            folders.push('/')
        }

        return folders?.map((folder, index) => {
            const path = folders.slice(0, index + 1).join('/');

            return {
                name: folder,
                path
            };
        })
    }, [selectedHost.sftpFileList]);

    const onClickDirectoryItemHandler = async (e: MouseEvent<HTMLButtonElement>, path: string) => {
        e.stopPropagation();

        if (selectedHost?.sftpHub && selectedHost.sftpFileList) {
            selectedHost.isLoad = true;
            selectedHost.sftpFilesOption.historyPrevPaths.push(selectedHost.sftpFileList.currentPath);
            selectedHost.sftpFilesOption.historyNextPaths.clear();
            selectedHost.sftpHub.getFilesServer(selectedHost.server.serverId, `/${path}`);
        }
    }

    const onBlurNavigationInput = () => {
        setActiveInput(false);

        if (selectedHost?.sftpHub && selectedHost.sftpFileList) {
            selectedHost.sftpFilesOption.historyPrevPaths.push(selectedHost.sftpFileList.currentPath);
            selectedHost.sftpFilesOption.historyNextPaths.clear();
            selectedHost.sftpHub.getFilesServer(selectedHost.server.serverId, editPathValue)
        }
    }

    const listDirectoriesElements = useMemo(() => {
        if (!listDirectories) {
            return <></>;
        }

        let directoriesToRender = listDirectories;

        // Если больше трех элементов, показываем последние lastVisibleCount , также добавляем в начало списка начальную кнопку навигации
        if (listDirectories.length > lastVisibleCount) {
            directoriesToRender = listDirectories.slice(-lastVisibleCount);

            directoriesToRender = [
                {
                    path: listDirectories[0].path,
                    name: '...'
                },
                ...directoriesToRender
            ];
        }

        return directoriesToRender.map((directoryItem) => {
            return (
                <div className={classNames(style.directory_item)} key={directoryItem.path}>
                    <Button
                        className={classNames(style.directory_button)}
                        onClick={async (e) => { await onClickDirectoryItemHandler(e, directoryItem.path); }}
                    >
                        <FolderIcon width={20} height={20}/>
                        <p>{directoryItem.name}</p>
                    </Button>
                    {directoryItem.path !== listDirectories[listDirectories.length - 1].path &&
                        <div className={classNames(style.arrow_icon)}>
                            <ArrowIcon width={20} height={20}/>
                        </div>
                    }

                </div>
            )
        })
    }, [listDirectories, lastVisibleCount])

    useEffect(() => { setPathValue(selectedHost.sftpFileList?.currentPath); }, [selectedHost.sftpFileList]);

    useEffect(() => {
        if (inputRef) { inputRef.current.focus(); }
    }, [isActiveInput]);

    useEffect(() => {
        if (selectedHost.sftpFilesOption.widthPanel) {
            setVisibleCount(selectedHost.sftpFilesOption.widthPanel > 460 ? 3 : 2);
        }
    }, [selectedHost.sftpFilesOption.widthPanel]);

    return (
        <div
            className={classNames(style.sftpCatalogNavigation, {
                [style.edit]: isActiveInput
            }, [className])}
            onClick={() => { setActiveInput(true); }}
        >
            <input
                type={'text'}
                ref={inputRef}
                className={classNames(style.edit_path_input)}
                value={editPathValue || ''}
                onChange={(e) => { setPathValue(e.target.value); }}
                onBlur={onBlurNavigationInput}
                autoFocus={true}
            />

            {listDirectoriesElements}
        </div>
    );
}

export default observer(SftpCatalogNavigation)
