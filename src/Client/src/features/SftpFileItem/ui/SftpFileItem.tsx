import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpFileItem.module.scss';
import { observer } from 'mobx-react-lite';
import { SftpCatalogMode, SftpFile } from 'app/services/SftpService/config/sftpConfig';
import sftpStore from 'app/store/sftpStore';
import FolderIcon from 'shared/assets/icons/sftp/folder.svg'
import FileIcon from 'shared/assets/icons/sftp/file.svg'
import {MouseEvent, useEffect, useRef, useState} from 'react';

interface SftpFileItemProps{
    className?: string;
    fileData: SftpFile;
    mode: SftpCatalogMode
}

function SftpFileItem ({ className, fileData, mode }: SftpFileItemProps) {
    const [isVisibleDate, setVisibleDate] = useState<boolean>(true);
    const fileItemRef = useRef<HTMLDivElement>(null);
    const selectedHost = mode === SftpCatalogMode.First
        ? sftpStore.firstSelectedHost
        : sftpStore.secondSelectedHost;
    
    const openFileHandler = async () => {
        if (fileData.fileType === 1) {
            selectedHost.filterOptions.title = "";
            selectedHost.isLoad = true;
            selectedHost.historyPrevPaths.push(selectedHost.sftpFileList.currentPath);
            selectedHost.historyNextPaths.clear();
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
        
        sftpStore.setSelectFileItem(mode, fileData.path);
    }

    const toLocalDateString = (dateString: string) => {
        if(!dateString || dateString.length === 0){
            return "";
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
        if(selectedHost.widthPanel){
            setVisibleDate(selectedHost.widthPanel > 460)
        }
    }, [selectedHost.widthPanel]);

    return (
        <div
            className={classNames(style.sftpFileItem, {
                [style.select]: fileData.isSelected
            }, [className])}
            onDoubleClick={openFileHandler}
            onClick={selectFileHandler}
            onContextMenu={contextManuHandler}
            title={fileData.name}
            ref={fileItemRef}
        >
            <div className={classNames(style.file_title)}>
                {fileData.fileType === 1
                    ? <FolderIcon width={25} height={25}/>
                    : <FileIcon width={27}/>}
                <div className={classNames(style.title)}>
                    {highlightMatches(fileData.name, selectedHost.filterOptions.title)}
                </div>
            </div>
            {isVisibleDate &&
                <div className={classNames(style.file_date)}>
                    {toLocalDateString(fileData.dateModified)}
                </div>
            }

            <div
                className={classNames(style.file_size, {
                    [style.center]: fileData.fileType === 1
                })}
            >
                {fileData.fileType === 1 ? '- -' : fileData.size}
            </div>
            <div className={classNames(style.file_type)}>
                {(fileData.fileTypeName &&
                    fileData.fileType !== 1 &&
                    fileData.fileTypeName.length > 0
                )
                    ? fileData.fileTypeName
                    : 'folder'}
            </div>
        </div>
    );
}

export default observer(SftpFileItem)
