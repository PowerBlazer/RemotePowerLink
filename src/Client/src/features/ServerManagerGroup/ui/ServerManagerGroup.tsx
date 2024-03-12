import { classNames } from 'shared/lib/classNames/classNames';
import style from './ServerManagerGroup.module.scss';
import {observer} from "mobx-react-lite";
import {ReactNode, useMemo} from "react";
import {DataTypeEnum} from "app/enums/DataTypeEnum";
import {ServerManagerItem} from "features/ServerManagerItem";

export interface ServerManagerData {
    id:number,
    title:string,
    common?: string,
    dataType: DataTypeEnum
    iconUrl?:string,
    iconNode?: ReactNode
}

export interface FilterOptions {
    
}

interface ServerManagerGroupProps {
    className?: string;
    serverManagerDataList?: ServerManagerData[],
    headerName: string
    filterOptions?: FilterOptions
}

export function ServerManagerGroup (props: ServerManagerGroupProps) {
    const {
        className,
        serverManagerDataList,
        headerName,
        filterOptions
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
                            <ServerManagerItem serverManagerDataItem={data} key={data.id}/>
                        )}
                    </div>
                )
            }

        </div>
    );
}