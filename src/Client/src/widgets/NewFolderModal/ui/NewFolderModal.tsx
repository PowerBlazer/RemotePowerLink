import {observer} from "mobx-react-lite";
import {Modal, ThemeModal, TypeModal} from "shared/ui/Modal";
import {Theme} from "shared/lib/Theme/ThemeContext";
import {Input} from "shared/ui/Input";
import {SftpCatalogModeProps} from "widgets/SftpCatalog";
import sftpStore from "app/store/sftpStore";
import {useTheme} from "shared/lib/Theme/useTheme";
import {ChangeEvent, useState} from "react";
import {useTranslation} from "react-i18next";
import {FileType} from "app/services/SftpService/config/sftpConfig";

interface NewFolderModalProps extends SftpCatalogModeProps{
    className?: string;
}

function NewFolderModal ({ className, mode }: NewFolderModalProps) {
    const selectedHost = sftpStore.getSelectedHostInMode(mode);
    const { theme } = useTheme();
    const { t } = useTranslation('translation')
    
    const [newFolderName, setFolderName] = useState<string>('');
    const [errors, setErrors] = useState<string[]>(
        ['Название папки не может быть пустым']
    );
    
    const createNewFolderHandler = async () => {
       
        
        selectedHost.modalOption.newFolderState = false
    }
    
    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setErrors([]);
        setFolderName(e.currentTarget.value);
        
        if(e.target?.value?.length === 0){
            setErrors([
                t('Название папки не может быть пустым')
            ]);
            
            return;
        }
        
        const fileListWithFolders = selectedHost?.sftpFileList?.fileList
            .filter(p=> p.fileType === FileType.Folder && p.name === e.target.value);
        
        if(fileListWithFolders.length > 0 || e.target.value === '.' || e.target.value === '..'){
            setErrors([
                t('Папка с таким название уже существует')
            ]);

            return;
        }
    }
    
    return (
        <Modal
            options={{
                type: TypeModal.FORM,
                headerName: 'New Folder',
                onCancel: () => { selectedHost.modalOption.newFolderState = false },
                onConfirm: createNewFolderHandler,
                disabled: errors.length > 0
            }}
            theme={ theme === Theme.LIGHT ? ThemeModal.CLEAR : ThemeModal.DARK }
            isVisible={ selectedHost?.modalOption.newFolderState }
        >
            <Input 
                type={"text"} 
                placeholder={t('Название новой папки')}
                value={newFolderName}
                errors={errors}
                onChange={onChangeInputHandler}
            />
        </Modal>
    );
}

async function delay (ms: number) {
    return await new Promise(resolve => setTimeout(resolve, ms));
}


export default observer(NewFolderModal)