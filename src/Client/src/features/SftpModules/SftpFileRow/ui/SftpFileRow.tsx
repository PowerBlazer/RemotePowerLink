import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpFileRow.module.scss';
import { observer } from 'mobx-react-lite';
import { FileType, SftpFile } from 'app/services/SftpService/config';
import sftpStore, { MenuMode } from 'app/store/sftpStore';
import FolderIcon from 'shared/assets/icons/sftp/folder.svg'
import FileIcon from 'shared/assets/icons/sftp/file.svg'
import { MouseEvent, useEffect, useRef, useState } from 'react';
import { SftpWindowsOptionProps } from 'widgets/SftpModules/SftpCatalog';
import { formatByteString } from 'shared/lib/formatByteString';
import useSftp from 'app/hooks/useSftp';

interface SftpFileRowProps extends SftpWindowsOptionProps {
    className?: string;
    fileData: SftpFile;
}

function SftpFileRow ({ className, fileData, windowsIndex }: SftpFileRowProps) {
    const [isVisibleDate, setVisibleDate] = useState<boolean>(true);
    const fileItemRef = useRef<HTMLTableRowElement>(null);
    const { getHost } = useSftp(windowsIndex);

    const selectedHost = getHost()

    const openFileHandler = async () => {
        if (fileData.fileType === FileType.Folder || fileData.fileType === FileType.BackNavigation) {
            selectedHost.sftpFilesOption.filterOptions.title = '';
            selectedHost.isLoad = true;
            selectedHost.sftpFilesOption.historyPrevPaths.push(selectedHost.sftpFileList.currentPath);
            selectedHost.sftpFilesOption.historyNextPaths.clear();

            await selectedHost?.sftpHub.getFilesServer(
                selectedHost.server.serverId,
                fileData.path
            );
        }
    }

    const highlightMatches = (name: string, title?: string) => {
        if (!title) {
            return name;
        }

        const nameArray = name.split('');
        const titleArray = title.toLowerCase().split('');

        return nameArray.map((char, index) => {
            if (titleArray.includes(char.toLowerCase())) {
                return <span key={index} className={classNames(style.highlight)}>{nameArray[index]}</span>;
            } else {
                return nameArray[index];
            }
        });
    };

    const selectFileHandler = (e: MouseEvent<HTMLDivElement>) => {
        if (e.ctrlKey) {
            sftpStore.setSelectFileItem(windowsIndex, fileData.path, false)
        } else {
            sftpStore.setSelectFileItem(windowsIndex, fileData.path)
        }
    }

    const contextMenuHandler = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault();

        if (fileData.fileType === FileType.BackNavigation) {
            return;
        }

        const rect = e.currentTarget
            .parentElement
            .parentElement
            .parentElement
            .getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        sftpStore.setSelectFileItem(windowsIndex, fileData.path, false, true);

        const selectedItemsCount = selectedHost?.sftpFilesOption
            .fileList?.filter(p => p.isSelected)?.length;

        if (selectedHost) {
            let mode = fileData.fileType === FileType.File
                ? MenuMode.File
                : MenuMode.Directory;

            if (selectedItemsCount && selectedItemsCount > 1) {
                mode = MenuMode.Multitude;
            }

            selectedHost.menuOption = {
                isVisible: true,
                menuMode: mode,
                heightWindow: e.currentTarget.parentElement.parentElement.parentElement.clientHeight,
                widthWindow: e.currentTarget.parentElement.parentElement.parentElement.clientWidth,
                x,
                y
            }
        }
    }

    const toLocalDateString = (dateString: string) => {
        if (!dateString || dateString.length === 0) {
            return '';
        }
        const date = new Date(dateString);
        let dateTimeString = date.toLocaleTimeString();

        const position = dateTimeString.lastIndexOf(':');

        if (position !== -1) {
            dateTimeString = dateTimeString.substring(0, position);
        }
        return `${date.toLocaleDateString()}, ${dateTimeString}`;
    }

    useEffect(() => {
        if (selectedHost.sftpFilesOption.widthPanel) {
            setVisibleDate(selectedHost.sftpFilesOption.widthPanel > 460)
        }
    }, [selectedHost.sftpFilesOption.widthPanel]);

    return (
        <tr
            className={classNames(style.sftpFileItem, {
                [style.select]: fileData.isSelected,
                [style.disable_hover]: selectedHost?.menuOption?.isVisible
            }, [className])}
            onDoubleClick={openFileHandler}
            onClick={selectFileHandler}
            onContextMenu={contextMenuHandler}
            title={fileData.name}
            ref={fileItemRef}
        >
            <td className={classNames(style.file_name)}>
                {fileData.fileType === FileType.Folder || fileData.fileType === FileType.BackNavigation
                    ? <FolderIcon width={25} height={25}/>
                    : <FileIcon width={27}/>
                }
                <div className={classNames(style.name)}>
                    {highlightMatches(fileData.name, selectedHost.sftpFilesOption.filterOptions.title)}
                </div>
            </td>
            {isVisibleDate &&
                <td className={classNames(style.file_date)}>
                    {toLocalDateString(fileData.dateModified)}
                </td>
            }
            <td
                className={classNames(style.file_size, {
                    [style.center]: fileData.fileType === FileType.Folder || fileData.fileType === FileType.BackNavigation
                })}
            >
                {fileData.fileType === FileType.Folder || fileData.fileType === FileType.BackNavigation
                    ? '- -'
                    : formatByteString(Number(fileData.size))}
            </td>
            <td className={classNames(style.file_type)}>
                {fileData.fileType === FileType.BackNavigation && ''}
                {fileData.fileTypeName
                    ? fileData.fileTypeName
                    : (fileData.fileType === FileType.Folder ? 'folder' : '')}
            </td>
        </tr>
    );
}

export default observer(SftpFileRow)
