import { classNames } from 'shared/lib/classNames/classNames';
import style from './ServerManagerGroup.module.scss';
import {observer} from "mobx-react-lite";
import {ReactNode} from "react";
import {DataType} from "app/enums/DataType";
import {ServerManagerItem} from "features/ServerManagerItem";

export interface ServerManagerData {
    id:number,
    title:string,
    common?: string,
    dataType: DataType
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
    
    return (
        <div className={classNames(style.serverManagerGroup, {}, [className])}>
            <h2 className={classNames(style.header)}>
                { Boolean(serverManagerDataList && serverManagerDataList.length > 0) && headerName }
            </h2>
            <div className={classNames(style.data_list)}>
                {serverManagerDataList?.map((data) =>
                    <ServerManagerItem serverManagerDataItem={data} key={data.id}/>
                )}
            </div>
		</div>
    );
}