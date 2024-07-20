import { classNames } from 'shared/lib/classNames/classNames';
import style from './ServerManagerItem.module.scss';
import { ServerManagerData } from 'features/ServerManagerGroup';
import { DataTypeEnum } from 'app/enums/DataTypeEnum';
import { ButtonConnect } from 'features/ButtonConnect';
import { ButtonEdit } from 'features/ButtonEdit';
import { ServerManagerCatalogMode } from 'widgets/ServerManagerCatalog/ui/ServerManagerCatalog';
import { ServerData } from 'app/services/ServerService/config/serverConfig';

interface ServerManagerItemProps {
    className?: string;
    serverManagerDataItem: ServerManagerData;
    onConnect?: (serverData: ServerData) => Promise<void>
    mode?: ServerManagerCatalogMode
}

export function ServerManagerItem (props: ServerManagerItemProps) {
    const {
        className,
        serverManagerDataItem,
        mode = ServerManagerCatalogMode.Catalog,
        onConnect
    } = props

    return (
        <div className={classNames(style.data_panel, {}, [className])}>
            <div className={classNames(style.data_info)}>
                <div className={classNames(style.data_icon)}>
                    {serverManagerDataItem.iconUrl
                        ? <img width={33} height={33} alt={'icon_object'} src={serverManagerDataItem.iconUrl}/>
                        : serverManagerDataItem.iconNode
                    }
                </div>
                <div className={classNames(style.data_title)}>
                    {serverManagerDataItem.title}
                    <div className={classNames(style.additionally)}>
                        {serverManagerDataItem.dataType === DataTypeEnum.SERVER && `ssh, ${serverManagerDataItem.common}`}
                        {serverManagerDataItem.dataType === DataTypeEnum.PROXY && 'HTTP'}
                        {serverManagerDataItem.dataType === DataTypeEnum.IDENTITY && serverManagerDataItem.common}
                    </div>
                </div>
            </div>
            <div className={classNames(style.data_options)}>
                {mode === ServerManagerCatalogMode.Catalog && <ButtonEdit className={style.button_edit} serverManagerData={serverManagerDataItem}/>}
                {serverManagerDataItem.dataType === DataTypeEnum.SERVER && onConnect &&
                    <ButtonConnect serverData={serverManagerDataItem} onConnect={onConnect}/>
                }
            </div>
        </div>
    );
}
