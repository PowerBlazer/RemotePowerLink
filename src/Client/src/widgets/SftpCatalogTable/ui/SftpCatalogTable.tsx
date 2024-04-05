import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpCatalogTable.module.scss';
import { observer } from 'mobx-react-lite';
import sftpStore from 'app/store/sftpStore';
import { Loader } from 'shared/ui/Loader/Loader';
import { SftpFileRow } from 'features/SftpFileRow';
import { SftpCatalogMode, SftpFile } from 'app/services/SftpService/config/sftpConfig';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import ArrowIcon from 'shared/assets/icons/arrow-prev.svg';
import { Button } from 'shared/ui/Button/Button';

interface SftpCatalogTableProps {
    className?: string;
    mode: SftpCatalogMode
}

function SftpCatalogTable ({ className, mode }: SftpCatalogTableProps) {
    const { t, i18n } = useTranslation('translation')
    const [isVisibleDate, setVisibleDate] = useState<boolean>(true);

    const selectedHost = sftpStore.getSelectedHostInMode(mode)
    const selectedHostFileItems = sftpStore.getFileItemsInMode(mode)

    const createColumnSortOptions = (key: keyof SftpFile) => {
        const columnSortInstance = selectedHost
            .filterOptions?.columnSort;

        let isVisible = false;
        let isReverse = false;

        if (columnSortInstance) {
            isVisible = columnSortInstance.columnKey === key;
            isReverse = columnSortInstance.isReverse;
        }

        const setFilterOptions = () => {
            sftpStore.setSftpFilterOptions(mode, {
                ...selectedHost.filterOptions,
                columnSort: !columnSortInstance
                    ? { columnKey: key, isReverse: false } // Создать новый объект, если columnSortInstance равен null
                    : !columnSortInstance.isReverse
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
            setFilterOptions
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
                            <SftpFileRow
                                key={file.path}
                                fileData={file}
                                mode={mode}
                            />
                        )
                    })
                    }
                </tbody>
            </table>
            {selectedHost?.isLoad && <Loader className={classNames(style.loader)}/>}
        </div>
    );
}

export default observer(SftpCatalogTable);
