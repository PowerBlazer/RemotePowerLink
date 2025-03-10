import { classNames } from 'shared/lib/classNames/classNames';
import style from './ThemeCard.module.scss';
import { TerminalTheme } from 'app/services/TerminalService/config';
import { Button } from 'shared/ui/Button/Button';
import { useTranslation } from 'react-i18next';

interface ThemeCardProps {
    className?: string;
    terminalTheme: TerminalTheme;
    isSelected: boolean;
    onClick?: () => void;
}

export function ThemeCard ({ className, terminalTheme, isSelected, onClick }: ThemeCardProps) {
    const { t } = useTranslation('translation');

    return (
        <Button
            className={classNames(style.themeCard, { [style.selected]: isSelected }, [className])}
            onClick={onClick}
        >
            <div
                className={classNames(style.preview)}
                style={{ backgroundColor: hexToRgba(terminalTheme.background), borderColor: terminalTheme.cursor }}
            >
                <div className={classNames(style.line)}>
                    <div
                        className={classNames(style.line_item)}
                        style={{ backgroundColor: hexToRgba(terminalTheme.foreground) }}
                    />
                </div>
                <div
                    className={classNames(style.line, {}, [style.stroke])}
                    style={{
                        boxShadow: `0px 0px 0px 3px ${hexToRgba(terminalTheme.selection)}`,
                        backgroundColor: hexToRgba(terminalTheme.selection)
                    }}
                >
                    <div
                        className={classNames(style.line_item)}
                        style={{ backgroundColor: hexToRgba(terminalTheme.foreground) }}
                    />
                    <div
                        className={classNames(style.line_item)}
                        style={{ backgroundColor: hexToRgba(terminalTheme.foreground) }}
                    />
                </div>
                <div className={classNames(style.line)}>
                    <div
                        className={classNames(style.line_item)}
                        style={{ backgroundColor: hexToRgba(terminalTheme.cyan) }}
                    />
                    <div
                        className={classNames(style.line_item)}
                        style={{ backgroundColor: hexToRgba(terminalTheme.foreground) }}
                    />
                    <div
                        className={classNames(style.line_item)}
                        style={{ backgroundColor: hexToRgba(terminalTheme.foreground) }}
                    />
                    <div className={classNames(style.cursor)} style={{ backgroundColor: terminalTheme.cursor }}/>
                </div>
                <div className={classNames(style.color_panel)}>
                    <div className={classNames(style.color_item)} style={{ backgroundColor: terminalTheme.red }}/>
                    <div className={classNames(style.color_item)} style={{ backgroundColor: terminalTheme.green }}/>
                    <div className={classNames(style.color_item)} style={{ backgroundColor: terminalTheme.yellow }}/>
                    <div className={classNames(style.color_item)} style={{ backgroundColor: terminalTheme.blue }}/>
                    <div className={classNames(style.color_item)} style={{ backgroundColor: terminalTheme.purple }}/>
                    <div className={classNames(style.color_item)} style={{ backgroundColor: terminalTheme.cyan }}/>
                </div>
            </div>
            <div className={classNames(style.info)}>
                <div className={classNames(style.name)}>{terminalTheme.name}</div>
                <div className={classNames(style.additional_info)}>{t('новая')}</div>
            </div>
        </Button>
    );
}
