import {classNames} from 'shared/lib/classNames/classNames';
import {observer} from 'mobx-react-lite';
import {Modal, ThemeModal, TypeModal} from 'shared/ui/Modal';
import {Theme} from 'shared/lib/Theme/ThemeContext';
import {SftpCatalogModeProps} from 'widgets/SftpCatalog';
import {useTranslation} from 'react-i18next';
import {useTheme} from 'shared/lib/Theme/useTheme';
import sftpStore from 'app/store/sftpStore';
import style from './UploadModal.module.scss';
import UploadIcon from 'shared/assets/icons/upload.svg';
import FileIcon from 'shared/assets/icons/sftp/file.svg';
import {ChangeEvent, DragEvent, useMemo, useRef, useState} from "react";
import {Button, ThemeButton} from "shared/ui/Button/Button";
import {Loader} from "shared/ui/Loader/Loader";
import {formatByteString} from "shared/lib/formatByteString";

interface UploadModalProps extends SftpCatalogModeProps {
    className?: string;
}

const maximumUploadSize = 5368709120;
function UploadModal ({ className, mode }: UploadModalProps) {
    const selectedHost = sftpStore.getSelectedHostInMode(mode);
    const { t } = useTranslation('translation');
    const { theme } = useTheme();

    const [isLoad, setLoad] = useState<boolean>(false);
    const [dragActive, setDragActive] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [fileList, setFileList] = useState<File[]>([]);

    const handleDrag = (e:DragEvent<HTMLDivElement | HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };
    
    const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        const fileItems = e.dataTransfer.files;
        
        if (fileItems) {
            const fileList: File[] = [];
         
            setLoad(true);
            for (let i = 0; i < fileItems.length; i++){
                const file = fileItems.item(i);
                
                if(file){
                    const isFile = await isFileAsync(file);
                    if(isFile){
                        fileList.push(file);
                    }
                }
            }
            
            setFileList(files => [...files, ...fileList]);
            setLoad(false);
        }
    } 
    
    const inputChangeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const fileList: File[] = [];
                
            setLoad(true);
            
            for (let i = 0; i < e.target.files.length; i++){
                const file = e.target.files.item(i);
                
                if(file){
                    const isFile = await isFileAsync(file);
                    if(isFile){
                        fileList.push(file);
                    }
                }
            }
            
            setFileList(files => [...files, ...fileList]);
            setLoad(false);
        }
    }

    const isFileAsync = (file: File): Promise<boolean> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
                // Если файл успешно прочитан, это, вероятно, файл, а не папка
                resolve(true);
            };
            reader.onerror = () => {
                // Если произошла ошибка при чтении файла, это, вероятно, папка
                resolve(false);
            };
            reader.readAsDataURL(file.slice(0, 4));
        });
    }

    const calculateTotalSize = (files: File[]) => {
        let totalSize = 0;
        for (let i = 0; i < files.length; i++) {
            totalSize += files[i].size;
        }
        return totalSize;
    };
    
    const browseFilesButton = useMemo(() => (
        <Button
            className={classNames(style.browse_files)}
            theme={ThemeButton.PRIMARY}
            onClick={() => inputRef?.current?.click()}
            disabled={fileList.length > 0 && calculateTotalSize(fileList) >= maximumUploadSize}
        >
            {fileList.length === 0 ? 'Browse files' : 'Add files'}
        </Button>
    ), [fileList, inputRef])

    return (
        <Modal
            options={{
                type: TypeModal.FORM,
                onCancel: () => { 
                    if(selectedHost) {
                        selectedHost.modalOption.uploadState = false;
                    }
                },
                onConfirm: async () => { },
                disabled: isLoad || (fileList.length > 0 && calculateTotalSize(fileList) >= maximumUploadSize),
                headerName: t('Загрузка файлов')
            }}
            className={className}
            theme={ theme === Theme.LIGHT ? ThemeModal.CLEAR : ThemeModal.DARK }
            isVisible={ selectedHost?.modalOption.uploadState }
        >
            <div className={classNames(style.input_files_panel)} >
                <input
                    ref={inputRef}
                    type='file'
                    multiple={true}
                    id='input-file-upload'
                    style={{display: 'none'}}
                    onChange={inputChangeHandler}
                />
                <label 
                    className={classNames(style.input_label, {
                        [style.drag_active]: dragActive,
                        [style.active]: fileList.length === 0 && !isLoad
                    })} 
                    htmlFor='input-file-upload'
                    onDragEnter={handleDrag}
                >
                    <UploadIcon width={75} height={75}/>
                    <p className={classNames(style.description)}>Drag and drop files here</p>
                    <p className={classNames(style.or)}>or</p>
                    { browseFilesButton }
                    { dragActive && 
                        <div
                            className={classNames(style.drag_window)}
                            onDragEnter={handleDrag} 
                            onDragLeave={handleDrag} 
                            onDragOver={handleDrag} 
                            onDrop={handleDrop}
                        ></div> }
                </label>
                { isLoad && <Loader className={classNames(style.loader)}/> }
                <div className={classNames(style.file_list_panel, {
                    [style.visible]: fileList.length > 0 && !isLoad
                })}>
                    <div className={classNames(style.size_added_files)}>
                        Размер добавленных файлов {formatByteString(calculateTotalSize(fileList))}
                        {calculateTotalSize(fileList) >= maximumUploadSize && 
                            <p className={classNames(style.error)}>Превышен лимит загрузки файлов (5GB)</p>
                        }
                    </div>
                    <div className={classNames(style.file_list)}>
                        {fileList.map((file, index) => (
                            <div className={classNames(style.file_item)} key={index}>
                                <div className={classNames(style.file_header)}>
                                    <FileIcon width={30}/>
                                    <div className={classNames(style.file_name)}>{file.name}</div>
                                </div>
                                <Button 
                                    className={classNames(style.delete_file)}
                                    onClick={() => {
                                        fileList.splice(index, 1);
                                        
                                        setFileList([...fileList])
                                    }}
                                >
                                    <div></div>
                                </Button>
                            </div>
                        ))}
                    </div>
                    {browseFilesButton}
                </div>
            </div>
        </Modal>
    );
}

export default observer(UploadModal)
