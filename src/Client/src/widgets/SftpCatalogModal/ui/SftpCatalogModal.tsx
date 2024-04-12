import { Modal, ThemeModal, TypeModal } from 'shared/ui/Modal';
import { useTheme } from 'shared/lib/Theme/useTheme';
import { Theme } from 'shared/lib/Theme/ThemeContext';
import { SftpCatalogModeProps } from 'widgets/SftpCatalog';
import sftpStore from "app/store/sftpStore";
import {useMemo} from "react";

interface SftpCatalogModalProps extends SftpCatalogModeProps {
    className?: string;
}

export function SftpCatalogModal ({ className, mode }: SftpCatalogModalProps) {
    const { theme } = useTheme();
    const selectedHost = sftpStore.getSelectedHostInMode(mode);
    
    const errorModal = useMemo(()=> (
        <Modal
            options={{ type: TypeModal.ERROR }}
            theme={ theme === Theme.LIGHT ? ThemeModal.CLEAR : ThemeModal.DARK }
            isVisible={Boolean(selectedHost.error)}
        >
            dsfdfdf
        </Modal>
    ),[selectedHost])
    
    const newFolder = useMemo(() => (
        <Modal
            options={{ type: TypeModal.FORM }}
            theme={ theme === Theme.LIGHT ? ThemeModal.CLEAR : ThemeModal.DARK }
            isVisible={Boolean(selectedHost.error)}
        >
            dsfdfdf
        </Modal>
    ),[selectedHost])
    
    
    
    return (
        {errorModal}
    );
}
