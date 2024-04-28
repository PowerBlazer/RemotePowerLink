import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpNotificationPanel.module.scss';
import {observer} from "mobx-react-lite";
import notificationStore from "app/store/notificationStore";
import {Loader} from "shared/ui/Loader/Loader";
import {Button} from "shared/ui/Button/Button";
interface SftpNotificationPanelProps {
    className?: string;
}

function SftpNotificationPanel ({ className }: SftpNotificationPanelProps) {
    const notificationData = notificationStore.downloadNotificationOptions?.data
    
    return (
        <div className={classNames(style.sftpNotificationPanel, {
            [style.active]: Boolean(notificationStore.downloadNotificationOptions)
        }, [className])}>
            <div className={classNames(style.information_panel)}>
                <Loader className={classNames(style.loader)}/>
                <div className={classNames(style.operation_name)}>{notificationData?.operationName}</div>
                <div className={classNames(style.infomation)}>
                    {notificationData?.informationText}
                </div>
            </div>
            <div className={classNames(style.tools_panel)}>
                <div className={classNames(style.progress_bar_panel, {
                    [style.active]: notificationData?.isProgress
                })}>
                    <div className={classNames(style.label)}>{notificationData?.progressPercent}%</div>
                    <div className={classNames(style.progress_bar)}>
                        <div className={classNames(style.bar)} style={{left: `${notificationData?.progressPercent - 100}%`}}></div>
                    </div>
                </div>

                <Button className={classNames(style.discard)} onClick={()=> {
                    if(notificationStore.downloadNotificationOptions?.onCancel){
                        notificationStore.downloadNotificationOptions?.onCancel();
                    }
                }}>
                    DISCARD
                </Button>
            </div>
		</div>
    );
}

export default observer(SftpNotificationPanel)