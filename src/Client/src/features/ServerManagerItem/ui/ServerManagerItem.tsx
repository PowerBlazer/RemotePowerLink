import {classNames} from 'shared/lib/classNames/classNames';
import style from './ServerManagerItem.module.scss';
import {ServerManagerData} from "features/ServerManagerGroup";
import {DataType} from "app/enums/DataType";
import {ButtonConnect} from "features/ButtonConnect";
import {ButtonEdit} from "features/ButtonEdit";

interface ServerManagerItemProps {
    className?: string;
    serverManagerDataItem: ServerManagerData;
    onEdit?: () => Promise<void>;
    
}

export function ServerManagerItem (props: ServerManagerItemProps) {
    const { 
        className,
        serverManagerDataItem, 
        onEdit 
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
                        {serverManagerDataItem.dataType === DataType.SERVER && `ssh, ${serverManagerDataItem.common}`}
                        {serverManagerDataItem.dataType === DataType.PROXY && 'HTTP'}
                    </div>
                </div>
            </div>
            <div className={classNames(style.data_options)}>
                <ButtonEdit className={style.button_edit} serverManagerData={serverManagerDataItem}/>
                {serverManagerDataItem.dataType === DataType.SERVER 
                    && <ButtonConnect serverData={serverManagerDataItem}/>
                }
            </div>
        </div>
    );
}
