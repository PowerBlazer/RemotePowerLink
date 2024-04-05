import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpFileCatalog.module.scss';
import { observer } from 'mobx-react-lite';
import sftpStore from 'app/store/sftpStore';
import { Loader } from 'shared/ui/Loader/Loader';
import { SftpFileItem } from 'features/SftpFileItem';
import {SftpCatalogMode, SftpFile} from 'app/services/SftpService/config/sftpConfig';
import {useTranslation} from "react-i18next";
import {useEffect, useMemo, useState} from "react";
import ArrowIcon from 'shared/assets/icons/arrow-prev.svg';
import {Button} from "shared/ui/Button/Button";

interface SftpFileCatalogProps{
    className?: string;
    mode: SftpCatalogMode
}

function SftpFileCatalog ({ className, mode }: SftpFileCatalogProps) {
    const { t, i18n } = useTranslation('translation')
    const [isVisibleDate, setVisibleDate] = useState<boolean>(true);
    
    const selectedHost = mode === SftpCatalogMode.First
        ? sftpStore.firstSelectedHost
        : sftpStore.secondSelectedHost;

    const selectedHostFileItems = mode === SftpCatalogMode.First
        ? sftpStore.firstHostFileItems
        : sftpStore.secondHostFileItems;

    const createColumnSortOptions = (key: keyof SftpFile) => {
        const columnSortInstance = selectedHost
            .filterOptions?.columnSort;

        let isVisible = false;
        let isReverse = false;

        if(columnSortInstance){
            isVisible = columnSortInstance.columnKey === key;
            isReverse = columnSortInstance.isReverse;
        }
        
        const setFilterOptions = () => {
            sftpStore.setSftpFilterOptions(mode, {
                ...selectedHost.filterOptions,
                columnSort: !columnSortInstance
                    ? { columnKey: key, isReverse: false } // Создать новый объект, если columnSortInstance равен null
                    : columnSortInstance.isReverse === false
                        ? { columnKey: key, isReverse: true } // Если isReverse равен false, поменять его на true
                        : null // Если isReverse равен true, установить columnSort в null
            });
        }
        
        return {
            isVisible,
            isReverse,
            setFilterOptions
        }
    }
    
    const nameColumn = useMemo(() => {
        const { 
            isVisible,
            isReverse,
            setFilterOptions,
        } = createColumnSortOptions('name');
        
        return (
            <Button 
                className={classNames(style.column_button)} 
                onClick={setFilterOptions}
            >
                {t('Название Столбец')}
                <div className={classNames(style.arrow_icon, {
                    [style.reverse]: isReverse,
                    [style.hidden]: !isVisible
                })}>
                    <ArrowIcon width={16} height={16}/>
                </div>
                
            </Button>
        )
    }, [i18n.language, selectedHost.filterOptions])

    const dateColumn = useMemo(() => {
        const {
            isVisible,
            isReverse,
            setFilterOptions
        } = createColumnSortOptions('dateModified');
        
        
        return (
            <Button
                className={classNames(style.column_button)}
                onClick={setFilterOptions}
            >
                {t('Дата изменения')}
                <div className={classNames(style.arrow_icon, {
                    [style.reverse]: isReverse,
                    [style.hidden]: !isVisible
                })}>
                    <ArrowIcon width={16} height={16}/>
                </div>
            </Button>
        )
    }, [i18n.language, selectedHost.filterOptions, isVisibleDate]);

    const sizeColumn = useMemo(() => {
        const {
            isVisible,
            isReverse,
            setFilterOptions
        } = createColumnSortOptions('size');
        
        
        return (
            <Button
                className={classNames(style.column_button)}
                onClick={setFilterOptions}
            >
                {t('Размер')}
                <div className={classNames(style.arrow_icon, {
                    [style.reverse]: isReverse,
                    [style.hidden]: !isVisible
                })}>
                    <ArrowIcon width={16} height={16}/>
                </div>
            </Button>
        )
    }, [i18n.language, selectedHost.filterOptions]);

    const typeColumn = useMemo(() => {
        const {
            isVisible,
            isReverse,
            setFilterOptions
        } = createColumnSortOptions('fileTypeName');
        
        return (
            <Button
                className={classNames(style.column_button)}
                onClick={setFilterOptions}
            >
                {t('Тип')}
                <div className={classNames(style.arrow_icon, {
                    [style.reverse]: isReverse,
                    [style.hidden]: !isVisible
                })}>
                    <ArrowIcon width={16} height={16}/>
                </div>
            </Button>
        )
    }, [i18n.language, selectedHost.filterOptions])


    useEffect(() => {
        if (selectedHost.widthPanel) {
            setVisibleDate(selectedHost.widthPanel > 460)
        }
    }, [selectedHost.widthPanel]);

    return (
        <div className={classNames(style.sftpFileCatalog, {}, [className])}>
            <table className={classNames(style.catalog_table)}>
                <thead className={classNames(style.columns_table)}>
                    <tr className={classNames(style.columns_row)}>
                        <th className={classNames(style.column, {}, [style.name_column, style.first_column])}>
                            {nameColumn}
                        </th>
                        {isVisibleDate &&
                            <th className={classNames(style.column, {}, [style.date_column])}>
                                {dateColumn}
                            </th>
                        }
                        <th className={classNames(style.column, {}, [style.size_column])}>
                            {sizeColumn}
                        </th>
                        <th className={classNames(style.column, {}, [style.type_column])}>
                            {typeColumn}
                        </th>
                    </tr>
                </thead>
                
                <tbody className={classNames(style.catalog_inner)}>
                    {!selectedHost?.isLoad && selectedHostFileItems?.map((file) => {
                        return (
                            <SftpFileItem
                                key={file.path}
                                fileData={file}
                                mode={mode}
                            />
                        )})
                    }
                </tbody>
                {selectedHost?.isLoad && <Loader className={classNames(style.loader)}/>}
            </table>

            {/*<div className={classNames(style.catalog_columns)}>*/}
            {/*    {nameColumn}*/}
            {/*    {isVisibleDate &&*/}
            {/*        dateColumn*/}
            {/*    }*/}
            {/*    {sizeColumn}*/}
            {/*    {typeColumn}*/}
            {/*</div>*/}
            
            {/*<div className={classNames(style.catalog_inner)}>*/}
            {/*    {selectedHost?.isLoad*/}
            {/*        ? <Loader className={classNames(style.loader)}/>*/}
            {/*        : selectedHostFileItems?.map((file) => {*/}
            {/*            return (*/}
            {/*                <SftpFileItem*/}
            {/*                    key={file.path}*/}
            {/*                    fileData={file}*/}
            {/*                    mode={mode}*/}
            {/*                />*/}
            {/*            )*/}
            {/*        })*/}
            {/*    }*/}
            {/*</div>*/}
        </div>
    );
}


export default observer(SftpFileCatalog);
