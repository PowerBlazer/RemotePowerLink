import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpFileRow.module.scss';
import { observer } from 'mobx-react-lite';
import { FileType, SftpFile } from 'app/services/SftpService/config';
import sftpStore, { MenuMode } from 'app/store/sftpStore';
import FolderIcon from 'shared/assets/icons/sftp/folder.svg'
import FileIcon from 'shared/assets/icons/sftp/file.svg'
import { MouseEvent, useEffect, useRef, useState } from 'react';
import { SftpCatalogModeProps } from 'widgets/SftpCatalog';

interface SftpFileRowProps extends SftpCatalogModeProps {
    className?: string;
    fileData: SftpFile;
}

function SftpFileRow ({ className, fileData, mode }: SftpFileRowProps) {
    const [isVisibleDate, setVisibleDate] = useState<boolean>(true);
    const fileItemRef = useRef<HTMLTableRowElement>(null);

    const selectedHost = sftpStore.getSelectedHostInMode(mode)

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
            sftpStore.setSelectFileItem(mode, fileData.path, false)
        } else {
            sftpStore.setSelectFileItem(mode, fileData.path)
        }
    }

    const contextManuHandler = (e: MouseEvent<HTMLDivElement>) => {
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

        sftpStore.setSelectFileItem(mode, fileData.path, false, true);

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

    function formatFileSize (fileSize: number): string {
        const byteConversion = 1024;
        const bytes = fileSize;

        if (bytes >= Math.pow(byteConversion, 3)) { // Гигабайты
            return `${(bytes / Math.pow(byteConversion, 3)).toFixed(2)} GB`;
        } else if (bytes >= Math.pow(byteConversion, 2)) { // Мегабайты
            return `${(bytes / Math.pow(byteConversion, 2)).toFixed(2)} MB`;
        } else if (bytes >= byteConversion) { // Килобайты
            return `${(bytes / byteConversion).toFixed(2)} KB`;
        } else { // Байты
            return `${bytes} bytes`;
        }
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
            onContextMenu={contextManuHandler}
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
                    : formatFileSize(Number(fileData.size))}
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
