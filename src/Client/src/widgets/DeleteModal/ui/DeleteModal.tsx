import { classNames } from 'shared/lib/classNames/classNames';
import style from './DeleteModal.module.scss';
import {observer} from "mobx-react-lite";
import {Modal, ThemeModal, TypeModal} from "shared/ui/Modal";
import {Theme} from "shared/lib/Theme/ThemeContext";
import sftpStore from "app/store/sftpStore";
import {SftpCatalogModeProps} from "widgets/SftpCatalog";
import {useTheme} from "shared/lib/Theme/useTheme";
import {useTranslation} from "react-i18next";
import {SftpService} from "app/services/SftpService/sftpService";

interface DeleteModalProps extends SftpCatalogModeProps{
    className?: string;
}

function DeleteModal ({ className, mode }: DeleteModalProps) {
    const selectedHost = sftpStore.getSelectedHostInMode(mode);
    const { theme } = useTheme();
    const { t } = useTranslation('translation') 
    
    const listFilesOrFoldersToDelete = selectedHost?.sftpFilesOption
        .fileList?.filter(p=> p.isSelected);
    
    const deleteFilesOrFolderHandler = async () => {
        if(selectedHost && listFilesOrFoldersToDelete){
            const deletedResult = await SftpService.deleteFilesOrFolders({
                filesOrFoldersToDeleteList: listFilesOrFoldersToDelete,
                serverId: selectedHost.server.serverId
            });
            
            if(deletedResult.isSuccess){
                selectedHost.isLoad = true;

                await selectedHost.sftpHub.getFilesServer(
                    selectedHost?.server.serverId,
                    selectedHost?.sftpFileList?.currentPath
                );
            }
            
            selectedHost.modalOption.deleteState = false;
            
            if(!deletedResult.isSuccess){
                selectedHost.error = { errors: deletedResult.errors }
                selectedHost.modalOption.errorState = true;
            }
        }
    }
    
    return (
        <Modal
            options={{
                type: TypeModal.DELETE,
                onCancel: () => { selectedHost.modalOption.deleteState = false; },
                onConfirm: deleteFilesOrFolderHandler,
                headerName: t('Вы хотите удалить эти папки и файлы?')
            }}
            className={className}
            theme={ theme === Theme.LIGHT ? ThemeModal.CLEAR : ThemeModal.DARK }
            isVisible={ selectedHost?.modalOption?.deleteState } 
        >
            <div className={classNames(style.delete_file_items)}>
                { listFilesOrFoldersToDelete?.map((fileItem) => (
                    <div className={classNames(style.file_item)} key={fileItem.path}>{fileItem.name}</div>
                ))}
            </div>
        </Modal>
    );
}

export default observer(DeleteModal);