import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpCatalogSwitcher.module.scss';
import { Button } from 'shared/ui/Button/Button';
import ArrowIcon from 'shared/assets/icons/arrow-prev.svg';
import sftpStore from 'app/store/sftpStore';
import {useCallback, useState} from 'react';
import { SftpCatalogMode } from 'app/services/SftpService/config/sftpConfig';

interface SftpCatalogSwitcherProps {
    className?: string;
    mode: SftpCatalogMode
}

export function SftpCatalogSwitcher ({ className, mode }: SftpCatalogSwitcherProps) {
    const [, updateState] = useState({});
    const forceUpdate = useCallback(() => updateState({}), []);
    
    const selectedHost = mode === SftpCatalogMode.First
        ? sftpStore.firstSelectedHost
        : sftpStore.secondSelectedHost;

    const onClickPrevButtonHandler = async () => {
       const previousPath = selectedHost.historyPrevPaths.pop();
       
       if(previousPath){
           selectedHost.historyNextPaths.push(selectedHost.sftpFileList.currentPath);
           await selectedHost.sftpHub.getFilesServer(selectedHost.server.serverId, previousPath);
           
           forceUpdate();
       }
    }

    const onClickNextButtonHandler = async () => {
        const nextPath = selectedHost.historyNextPaths.pop();

        if(nextPath){
            selectedHost.historyPrevPaths.push(selectedHost.sftpFileList?.currentPath);
            await selectedHost.sftpHub.getFilesServer(selectedHost.server.serverId, nextPath);
            
            forceUpdate();
        }
    }

    return (
        <div className={classNames(style.sftpCatalogSwitcher, {}, [className])}>
            <Button 
                className={classNames(style.prev_button, {
                    [style.active]: selectedHost.historyPrevPaths.size() > 0
                })} 
                onClick={onClickPrevButtonHandler}
            >
                <div className={classNames(style.arrow_icon)}>
                    <ArrowIcon width={20} height={20}/>
                </div>
            </Button>
            <Button 
                className={classNames(style.next_button,{
                    [style.active]: selectedHost.historyNextPaths.size() > 0
                })} 
                onClick={onClickNextButtonHandler}
            >
                <div className={classNames(style.arrow_icon)}>
                    <ArrowIcon width={20} height={20}/>
                </div>
            </Button>
        </div>
    );
}
