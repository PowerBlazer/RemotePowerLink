import { classNames } from 'shared/lib/classNames/classNames';
import style from './PageConnectionError.module.scss';
import {HostService} from "app/services/hostService";
import {DefaultServerIcon} from "shared/ui/DefaultServerIcon";
import {Button} from "shared/ui/Button/Button";
import {SftpServer} from "app/store/sftpStore";
import {useTranslation} from "react-i18next";

interface PageConnectionErrorProps {
    className?: string;
    selectedHost: SftpServer
    onCloseConnectionServer?: () => Promise<void>,
    onSwitchEditingHostMode?: () => Promise<void>,
    onReconnectHost?: () => Promise<void>
}

export function PageConnectionError (props: PageConnectionErrorProps) {
    const { t } = useTranslation('translation');
    
    const {
        className,
        selectedHost,
        onCloseConnectionServer,
        onSwitchEditingHostMode,
        onReconnectHost
    } = props
    
    return (
        <div className={classNames(style.connection_error_panel,{}, [className])}>
            <div className={classNames(style.panel_inner)}>
                <div className={classNames(style.server_logo)}>
                    {selectedHost?.server.systemTypeIcon
                        ? <img
                            src={`${HostService._resourceHost}${selectedHost?.server.systemTypeIcon}`}
                            alt={'server_logo'}
                            width={37}
                            height={37}
                        />
                        : <DefaultServerIcon width={22} height={22}/>}
                    <div className={classNames(style.server_information)}>
                        <div className={classNames(style.name)}>{selectedHost?.server.title}</div>
                        <div
                            className={classNames(style.about)}>SSH {selectedHost?.server.hostname}:{selectedHost?.server.sshPort ?? 22}</div>
                    </div>
                </div>
                <div className={classNames(style.red_line)}></div>
                <div className={classNames(style.error_message)}>{selectedHost?.error?.errors?.Connection}</div>
                <div className={classNames(style.tools_panel)}>
                    <div className={classNames(style.close_or_edit)}>
                        <Button className={classNames(style.close)} onClick={onCloseConnectionServer}>
                            {t('Закрыть')}
                        </Button>
                        <Button className={classNames(style.edit_host)} onClick={onSwitchEditingHostMode}>
                            {t('Редактировать сервер')}
                        </Button>
                    </div>
                    <div className={classNames(style.start_over_panel)}>
                        <Button className={classNames(style.start_over)} onClick={onReconnectHost}>
                            {t('Повторно подлючиться')}
                        </Button>
                    </div>
                </div>
            </div>

        </div>
    );
}