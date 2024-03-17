import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpFileItem.module.scss';
import {observer} from "mobx-react-lite";
import {SftpFile} from "app/services/SftpService/config/sftpConfig";
import {SftpCatalogMode} from "widgets/SftpCatalog";
import sftpStore from "app/store/sftpStore";

interface SftpFileItemProps {
    className?: string;
    fileData: SftpFile;
    mode: SftpCatalogMode
}

function SftpFileItem ({ className,fileData,mode }: SftpFileItemProps) {
    const selectedHost = mode === SftpCatalogMode.First
        ? sftpStore.firstSelectedHost
        : sftpStore.secondSelectedHost;
    
    return (
        <div 
            className={classNames(style.SftpFileItem, {}, [className])}
            onClick={()=> {
                if(fileData.fileType === 1){
                    selectedHost?.sftpHub.getFilesServer(selectedHost.server.serverId, fileData.path)
                }       
            }}    
        >
            {fileData.name}
		</div>
    );
}

export default observer(SftpFileItem)