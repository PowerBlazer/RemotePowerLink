import { SftpWindowsOptionProps } from 'widgets/SftpModules/SftpCatalog';

export interface MenuOptionProp extends SftpWindowsOptionProps {
    disabled?: boolean,
    onClick?: () => void
}
