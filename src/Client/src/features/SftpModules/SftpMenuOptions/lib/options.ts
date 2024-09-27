import { SftpCatalogModeProps } from 'widgets/SftpModules/SftpCatalog';

export interface MenuOptionProp extends SftpCatalogModeProps {
    disabled?: boolean,
    onClick?: () => void
}
