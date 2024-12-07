import { classNames } from 'shared/lib/classNames/classNames';
import { ServerManagerCatalog, ServerManagerCatalogMode } from 'widgets/ServerManagerCatalog';
import { Button } from 'shared/ui/Button/Button';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { ServerData } from 'app/services/ServerService/config/serverConfig';
import { SearchInput } from 'features/SearchInput';
import ArrowRight from 'shared/assets/icons/arrow-right.svg';
import searchStore from 'app/store/searchStore';
import style from './SftpSelectHostCatalog.module.scss';
import { SftpWindowsOptionProps } from 'widgets/SftpModules/SftpCatalog';
import useSftp from 'app/hooks/useSftp';

interface SftpSelectHostCatalogProps extends SftpWindowsOptionProps {
    className?: string,
    onClose?: () => void,
}

export function SftpSelectHostCatalog ({ className, onClose, windowsIndex }: SftpSelectHostCatalogProps) {
    const { t } = useTranslation('translation');
    const { connectSftp } = useSftp(windowsIndex);

    const onChangeSearchInputHandler = (value: string) => {
        searchStore.setFilterOption({
            title: value
        })
    }

    const onClickCloseSelectHostCatalog = () => {
        if (onClose) {
            onClose();
        }
    }

    const onClickConnectHandler = async (serverData: ServerData) => {
        await connectSftp(serverData)

        if (onClose) {
            onClose();
        }
    }

    useEffect(() => {
        searchStore.setFilterOption(null)
    }, []);

    return (
        <div className={classNames(style.sftpSelectHostCatalog, {}, [className])}>
            <div className={classNames(style.select_navbar)}>
                <div className={classNames(style.header_navbar)}>
                    <Button className={classNames(style.close)} onClick={onClickCloseSelectHostCatalog}>
                        <ArrowRight width={17} height={17}></ArrowRight>
                    </Button>
                    <h3 className={classNames(style.header_text)}>{t('Выбрать сервер')}</h3>
                </div>
                <div className={classNames(style.search_catalog_panel)}>
                    <SearchInput onChange={onChangeSearchInputHandler}/>
                    <div className={style.tools}></div>
                </div>
            </div>
            <ServerManagerCatalog mode={ServerManagerCatalogMode.Sftp} onConnect={onClickConnectHandler}/>
        </div>
    );
}
