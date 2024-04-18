export enum ThemeModal {
    CLEAR = 'clear',
    DARK = 'dark'
}

export enum TypeModal {
    ERROR = 'error',
    DEFAULT = 'default',
    FORM = 'form',
    DELETE = 'delete'
}

export interface ModalOptions {
    type: TypeModal
    onCancel?: () => void,
    onConfirm?: () => Promise<void>,
    headerName?: string,
    disabled?: boolean
}
