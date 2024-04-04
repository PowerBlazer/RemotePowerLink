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
                className={classNames(style.title_column,{}, [style.column])} 
                onClick={setFilterOptions}
            >
                {t('Название Столбец')}
                {isVisible &&
                    <div className={classNames(style.arrow_icon, {[style.reverse]: isReverse})}>
                        <ArrowIcon width={16} height={16}/>
                    </div>
                }
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
                className={classNames(style.date_column, {}, [style.column])}
                onClick={setFilterOptions}
            >
                {t('Дата изменения')}
                {isVisible &&
                    <div className={classNames(style.arrow_icon, {[style.reverse]: isReverse})}>
                        <ArrowIcon width={16} height={16}/>
                    </div>
                }
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
                className={classNames(style.size_column, {}, [style.column])}
                onClick={setFilterOptions}
            >
                {t('Размер')}
                {isVisible &&
                    <div className={classNames(style.arrow_icon, {[style.reverse]: isReverse})}>
                        <ArrowIcon width={16} height={16}/>
                    </div>
                }
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
                className={classNames(style.format_column, {}, [style.column])}
                onClick={setFilterOptions}
            >
                {t('Тип')}
                {isVisible &&
                    <div className={classNames(style.arrow_icon, {[style.reverse]: isReverse})}>
                        <ArrowIcon width={16} height={16}/>
                    </div>
                }
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
            <div className={classNames(style.catalog_columns)}>
                {nameColumn}
                {dateColumn}
                {sizeColumn}
                {typeColumn}
            </div>

            <div className={classNames(style.catalog_inner_table)}>
                {selectedHost?.isLoad
                    ? <Loader className={classNames(style.loader)}/>
                    : selectedHostFileItems?.map((file) => {
                        return (
                            <SftpFileItem
                                key={file.path}
                                fileData={file}
                                mode={mode}
                            />
                        )
                    })
                }
            </div>
        </div>
    );
}


export default observer(SftpFileCatalog);
