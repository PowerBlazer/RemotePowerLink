import {classNames} from 'shared/lib/classNames/classNames';
import style from './SftpMenu.module.scss';
import {observer} from 'mobx-react-lite';
import {SftpCatalogMode} from "app/services/SftpService/config/sftpConfig";
import sftpStore, {MenuMode} from "app/store/sftpStore";
import {useOutsideClick} from "app/hooks/useOutsideClick";
import {Close, Download, NewFolder, Refresh, Rename, SelectAll, Unload} from "features/SftpMenuOptions";
import {forwardRef, MutableRefObject, useEffect, useMemo, useState} from "react";
import {Delete} from "features/SftpMenuOptions/ui/Delete";

interface SftpMenuProps {
    className?: string;
    mode: SftpCatalogMode,
    isVisible: boolean,
    isPosition?: boolean,
    onClose?: () => void
}

const topPaddingMenu = 15;
const leftPaddingMenu = 5;

const SftpMenu = forwardRef(
    function SftpMenu (props: SftpMenuProps, actionButtonRef: MutableRefObject<HTMLButtonElement>) {
        const {
            className,
            mode,
            isPosition = true,
            isVisible,
            onClose
        } = props;
    
        const selectedHost = sftpStore.getSelectedHostInMode(mode);
        const selectedFileItems = sftpStore.getFileItemsInMode(mode);
        const [isVisibleMenu, setVisibleMenu] = useState<boolean>(isVisible);
        
        const menuRef = useOutsideClick<HTMLDivElement>(() => {
            if(onClose){
                onClose();
            }
            
            if(isPosition && selectedHost.menuOption){
                selectedHost.menuOption.isVisible = false
            }
    
            setVisibleMenu(false)
        },[actionButtonRef?.current]);
     
        let yPx = selectedHost?.menuOption?.y;
        if(menuRef && selectedHost && selectedHost.menuOption){
            const sizeY =  selectedHost.menuOption.heightWindow - yPx;
    
            if(sizeY < menuRef.current?.clientHeight){
                yPx = yPx - menuRef.current?.clientHeight - 15
            }
        }
        
        const onClickCloseMenuHandler = () => {
            setVisibleMenu(false);
            
            if(isPosition && selectedHost.menuOption){
                selectedHost.menuOption.isVisible = false
            }
            
            if(onClose){
                onClose();
            }
        }
        
        const defaultModeMenuOptions = useMemo(() => {
            const selectedItemsCount = selectedFileItems
                .filter(p=> p.isSelected)?.length;
    
            const isDisabled = !selectedItemsCount || selectedItemsCount === 0;
    
            return [
                <Rename mode={mode} key='Rename' disabled={isDisabled} onClick={onClickCloseMenuHandler}/>,
                <Delete mode={mode} key='Delete' disabled={isDisabled} onClick={onClickCloseMenuHandler}/>,
                <Refresh mode={mode} key='Refresh' onClick={onClickCloseMenuHandler}/>,
                <NewFolder mode={mode} key='NewFolder' onClick={onClickCloseMenuHandler}/>,
                <SelectAll mode={mode} key='SelectAll' onClick={onClickCloseMenuHandler}/>,
                <Download mode={mode} key='Download' disabled={isDisabled} onClick={onClickCloseMenuHandler}/>,
                <Unload mode={mode} key='Unload' disabled={isDisabled} onClick={onClickCloseMenuHandler}/>,
                <Close mode={mode} key='Close' onClick={onClickCloseMenuHandler}/>
            ]
        } ,[selectedFileItems]);
    
        const fileModeMenuOptions = useMemo(() =>  [
            <Rename mode={mode} key='Rename' onClick={onClickCloseMenuHandler}/>,
            <Delete mode={mode} key='Delete' onClick={onClickCloseMenuHandler}/>,
            <Download mode={mode} key='Download' onClick={onClickCloseMenuHandler}/>,
            <NewFolder mode={mode} key='NewFolder' onClick={onClickCloseMenuHandler}/>,
            <SelectAll mode={mode} key='SelectAll' onClick={onClickCloseMenuHandler}/>
        ], [selectedFileItems]);
        
        const folderModeMenuOptions = useMemo(()=> [
            <Rename mode={mode} key='Rename' onClick={onClickCloseMenuHandler}/>,
            <Delete mode={mode} key='Delete' onClick={onClickCloseMenuHandler}/>,
            <Download mode={mode} key='Download' onClick={onClickCloseMenuHandler}/>,
            <NewFolder mode={mode} key='NewFolder' onClick={onClickCloseMenuHandler}/>,
            <SelectAll mode={mode} key='SelectAll' onClick={onClickCloseMenuHandler}/>
        ],[selectedFileItems]);
        
        const multitudeModeMenuOptions = useMemo(() => [
            <Rename mode={mode} key='Rename' onClick={onClickCloseMenuHandler} disabled={true}/>,
            <Delete mode={mode} key='Delete' onClick={onClickCloseMenuHandler}/>,
            <Download mode={mode} key='Download' onClick={onClickCloseMenuHandler}/>,
            <NewFolder mode={mode} key='NewFolder' onClick={onClickCloseMenuHandler} disabled={true}/>,
            <SelectAll mode={mode} key='SelectAll' onClick={onClickCloseMenuHandler} disabled={true}/>
        ],[selectedFileItems])
        
        useEffect(() => {
            setVisibleMenu(isVisible)
        }, [isVisible]);
    
        return (
            <div
                style={{
                    top: yPx && isPosition ? yPx + topPaddingMenu : '',
                    left: selectedHost?.menuOption?.x && isPosition ? selectedHost?.menuOption?.x + leftPaddingMenu : ''
                }}
                className={classNames(style.sftpMenuOptions, {
                    [style.visible]: isVisibleMenu
                }, [className])}
                ref={menuRef}
            >
                {selectedHost?.menuOption?.menuMode === MenuMode.Default && defaultModeMenuOptions}
                {selectedHost?.menuOption?.menuMode === MenuMode.File && fileModeMenuOptions}
                {selectedHost?.menuOption?.menuMode === MenuMode.Directory && folderModeMenuOptions}
                {selectedHost?.menuOption?.menuMode === MenuMode.Multitude && multitudeModeMenuOptions}
            </div>
        );
    }
)




export default observer(SftpMenu);
