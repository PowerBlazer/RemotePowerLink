export interface TerminalTheme {
    id: number,
    name: string,
    black: string,
    red: string,
    green: string,
    yellow: string,
    blue: string,
    purple: string,
    cyan: string,
    white: string,
    brightBlack: string,
    brightRed: string,
    brightGreen: string,
    brightYellow: string,
    brightBlue: string,
    brightPurple: string,
    brightCyan: string,
    brightWhite: string,
    background: string,
    foreground: string,
    cursor: string,
    selection: string
}

export interface TerminalSetting {
    fontSize: number,
    terminalThemeId: number
}

export interface UpdateTerminalSettingData {
    fontSize: number,
    terminalThemeId: number
}
