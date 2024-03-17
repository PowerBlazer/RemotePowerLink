import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpCatalogSwitcher.module.scss';
import {SftpCatalogMode} from "widgets/SftpCatalog";
import {Button} from "shared/ui/Button/Button";
import ArrowIcon from 'shared/assets/icons/arrow-prev.svg';
import sftpStore from "app/store/sftpStore";

interface SftpCatalogSwitcherProps {
    className?: string;
    mode: SftpCatalogMode
}

export function SftpCatalogSwitcher ({ className, mode }: SftpCatalogSwitcherProps) {
    const selectedHost = mode === SftpCatalogMode.First
        ? sftpStore.firstSelectedHost
        : sftpStore.secondSelectedHost;
    
    return (
        <div className={classNames(style.sftpCatalogSwitcher, {}, [className])}>
            <Button className={classNames(style.prev_button)} onClick={()=>{
                const currentPath = selectedHost.sftpFileList.currentPath;
                const newPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
                
                selectedHost.sftpHub.getFilesServer(selectedHost.server.serverId,newPath)
            }}>
                <div className={classNames(style.arrow_icon)}>
                    <ArrowIcon width={20} height={20}/>
                </div>
            </Button>
            <Button className={classNames(style.next_button)}>
                <div className={classNames(style.arrow_icon)}>
                    <ArrowIcon width={20} height={20}/>
                </div>
            </Button>
        </div>
    );
}