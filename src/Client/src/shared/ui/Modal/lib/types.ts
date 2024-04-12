export enum ThemeModal {
    CLEAR = 'clear',
    DARK = 'dark'
}

export enum TypeModal {
    ERROR = 'error',
    DEFAULT = 'default',
    FORM = 'form'
}

export interface ModalOptions {
    type: TypeModal
    onCancel?: () => void,
    onConfirm?: () => void,
    headerName?: string
}
