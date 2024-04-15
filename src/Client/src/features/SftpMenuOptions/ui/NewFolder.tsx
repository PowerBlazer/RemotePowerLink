import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpMenuOptions.module.scss';
import { MenuOptionProp } from 'features/SftpMenuOptions';
import { Button } from 'shared/ui/Button/Button';
import sftpStore from "app/store/sftpStore";
import {Tr} from "@chakra-ui/react";

interface NewFolderProps extends MenuOptionProp {
    className?: string;
}

export function NewFolder ({ className, disabled, mode, onClick }: NewFolderProps) {
    const selectedHost = sftpStore.getSelectedHostInMode(mode);
   
    const onClickNewFolderHandler = () => {
        if (disabled) { return; }
        
        if(selectedHost){
            selectedHost.modalOption.newFolderState = true;
        }
        
        if (onClick) {
            onClick();
        }
    }

    return (
        <Button
            className={classNames(style.newFolder, { [style.disabled]: disabled }, [className, style.menu_item])}
            onClick={onClickNewFolderHandler}
        >
            New Folder
        </Button>
    );
}
