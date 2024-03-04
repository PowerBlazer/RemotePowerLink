import {classNames} from 'shared/lib/classNames/classNames';
import style from './ServerManagerItem.module.scss';
import {observer} from "mobx-react-lite";
import {ServerManagerData} from "features/ServerManagerGroup";
import {Button} from "shared/ui/Button/Button";
import {DataType} from "app/enums/DataType";

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
        <Button className={classNames(style.data_panel, {}, [className])}>
            <div className={classNames(style.data_info)}>
                <div className={classNames(style.data_icon)}>
                    {serverManagerDataItem.iconUrl 
                        ? <img width={33} height={33} alt={'icon_object'} src={serverManagerDataItem.iconUrl}/>
                        : serverManagerDataItem.iconNode
                    }
                </div>
                <div className={classNames(style.data_title)}>
                    {serverManagerDataItem.title}
                    <p className={classNames(style.additionally)}>
                        {serverManagerDataItem.dataType === DataType.SERVER && 'ssh'}
                    </p>
                </div>
            </div>
            <div className={classNames(style.data_options)}>
                
            </div>
        </Button>
    );
}
