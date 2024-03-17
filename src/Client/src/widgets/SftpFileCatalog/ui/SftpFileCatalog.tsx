import {classNames} from 'shared/lib/classNames/classNames';
import style from './SftpFileCatalog.module.scss';
import {observer} from "mobx-react-lite";
import {SftpCatalogMode} from "widgets/SftpCatalog";
import sftpStore from "app/store/sftpStore";
import {useMemo} from "react";
import {Loader} from "shared/ui/Loader/Loader";
import {SftpFileItem} from "features/SftpFileItem";

interface SftpFileCatalogProps {
    className?: string;
    mode: SftpCatalogMode
}

function SftpFileCatalog ({ className, mode }: SftpFileCatalogProps) {
    const selectedHost = mode === SftpCatalogMode.First 
        ? sftpStore.firstSelectedHost
        : sftpStore.secondSelectedHost;
    
    
    return (
        <div className={classNames(style.sftpFileCatalog, {}, [className])}>
            {selectedHost?.isLoad 
                ? <Loader  className={classNames(style.loader)}/> 
                : selectedHost?.sftpFileList?.fileList.map((file)=> {
                    return (
                        <SftpFileItem key={file.path} fileData={file} mode={mode}/>
                    )
                })
            }
		</div>
    );
}

export default observer(SftpFileCatalog);