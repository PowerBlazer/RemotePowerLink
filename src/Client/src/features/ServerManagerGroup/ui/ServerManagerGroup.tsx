import {classNames} from 'shared/lib/classNames/classNames';
import style from './ServerManagerGroup.module.scss';
import {ReactNode, useMemo} from "react";
import {DataTypeEnum} from "app/enums/DataTypeEnum";
import {ServerManagerItem} from "features/ServerManagerItem";
import {ServerManagerCatalogMode} from "widgets/ServerManagerCatalog/ui/ServerManagerCatalog";

export interface ServerManagerData {
    id:number,
    title:string,
    common?: string,
    dataType: DataTypeEnum
    iconUrl?:string,
    iconNode?: ReactNode
}

interface ServerManagerGroupProps {
    className?: string;
    serverManagerDataList?: ServerManagerData[],
    headerName: string
    mode?: ServerManagerCatalogMode,
    onConnect?: () => Promise<void>
}

export function ServerManagerGroup (props: ServerManagerGroupProps) {
    const {
        className,
        serverManagerDataList,
        headerName,
        mode = ServerManagerCatalogMode.Catalog,
        onConnect
    } = props;
    
    const isVisible = useMemo<boolean>(() => 
        serverManagerDataList && serverManagerDataList.length > 0,
        [serverManagerDataList]
    );
    
    return (
        <div 
            className={classNames(style.serverManagerGroup, {
                [style.disable]: !isVisible
            }, [className])}
        >
            <h2 className={classNames(style.header)}>
                { isVisible && headerName }
            </h2>
            {
                isVisible && (
                    <div className={classNames(style.data_list)}>
                        {serverManagerDataList?.map((data) =>
                            <ServerManagerItem 
                                serverManagerDataItem={data} 
                                mode={mode} 
                                key={data.id}
                                onConnect={onConnect}
                            />
                        )}
                    </div>
                )
            }

        </div>
    );
}