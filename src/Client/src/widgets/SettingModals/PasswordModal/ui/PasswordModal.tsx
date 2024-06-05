import {observer} from "mobx-react-lite";
import {Modal, ThemeModal} from "shared/ui/Modal";
import {useTheme} from "shared/lib/Theme/useTheme";
import {Theme} from "shared/lib/Theme/ThemeContext";
import userStore from "app/store/userStore";

interface PasswordModalProps {
    className?: string;
}

export function PasswordModal ({ className }: PasswordModalProps) {
    const { theme } = useTheme();
    
    return (
      
        <></>
            
    );
}

export default observer(PasswordModal)