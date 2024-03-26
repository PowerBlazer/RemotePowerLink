import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpFileCatalog.module.scss';
import { observer } from 'mobx-react-lite';
import sftpStore from 'app/store/sftpStore';
import { Loader } from 'shared/ui/Loader/Loader';
import { SftpFileItem } from 'features/SftpFileItem';
import { SftpCatalogMode } from 'app/services/SftpService/config/sftpConfig';

interface SftpFileCatalogProps {
    className?: string;
    mode: SftpCatalogMode
}

function SftpFileCatalog ({ className, mode }: SftpFileCatalogProps) {
    const selectedHost = mode === SftpCatalogMode.First
        ? sftpStore.firstSelectedHost
        : sftpStore.secondSelectedHost;

    const selectedHostFileItems = mode === SftpCatalogMode.First
        ? sftpStore.firstHostFileItems
        : sftpStore.secondHostFileItems;

    return (
        <div className={classNames(style.sftpFileCatalog, {}, [className])}>
            <div className={classNames(style.catalog_columns)}>

            </div>
            <div className={classNames(style.catalog_inner)}>
                {selectedHost?.isLoad
                    ? <Loader className={classNames(style.loader)}/>
                    : selectedHostFileItems?.map((file) => {
                        return (
                            <SftpFileItem key={file.path} fileData={file} mode={mode}/>
                        )
                    })
                }
            </div>
        </div>
    );
}

export default observer(SftpFileCatalog);
