import { SftpCatalogModeProps } from 'widgets/SftpCatalog';

export interface MenuOptionProp extends SftpCatalogModeProps {
    disabled?: boolean,
    onClick?: () => void
}
