import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpNotificationPanel.module.scss';
import { observer } from 'mobx-react-lite';
import { Loader } from 'shared/ui/Loader/Loader';
import { Button } from 'shared/ui/Button/Button';
import { SftpCatalogModeProps } from 'widgets/SftpModules/SftpCatalog';
import sftpStore from 'app/store/sftpStore';
import { useTranslation } from 'react-i18next';
interface SftpNotificationPanelProps extends SftpCatalogModeProps {
    className?: string;
}

function SftpNotificationPanel ({ className, mode }: SftpNotificationPanelProps) {
    const selectedHost = sftpStore.getHostInMode(mode);
    const notificationOptions = selectedHost?.notificationOptions;
    const { t } = useTranslation('translation');

    return (
        <div className={classNames(style.sftpNotificationPanel, {
            [style.active]: Boolean(notificationOptions)
        }, [className])}>
            <div className={classNames(style.information_panel)}>
                <Loader className={classNames(style.loader)}/>
                <div className={classNames(style.information_panel_inner)}>
                    <div className={classNames(style.operation_name)}>{t(notificationOptions?.data.operationName)}</div>
                    <div className={classNames(style.infomation)}>
                        {notificationOptions?.data.informationText}
                    </div>
                </div>

            </div>
            <div className={classNames(style.tools_panel)}>
                <div className={classNames(style.progress_bar_panel, {
                    [style.active]: notificationOptions?.data.isProgress
                })}>
                    <div className={classNames(style.label)}>{notificationOptions?.data.progressPercent}%</div>
                    <div className={classNames(style.progress_bar)}>
                        <div className={classNames(style.bar)} style={{ left: `${notificationOptions?.data.progressPercent - 100}%` }}></div>
                    </div>
                </div>

                <Button className={classNames(style.discard)} onClick={() => {
                    if (notificationOptions?.onCancel) {
                        notificationOptions?.onCancel();
                    }
                }}>
                    {t('Прервать')}
                </Button>
            </div>
        </div>
    );
}

export default observer(SftpNotificationPanel)
