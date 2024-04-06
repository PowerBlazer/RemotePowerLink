import {SftpCatalogMode} from "app/services/SftpService/config/sftpConfig";

export interface MenuOptionProp{
    disabled?: boolean,
    mode: SftpCatalogMode,
    onClick?: () => void
}