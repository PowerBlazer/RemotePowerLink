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
import sftpStore, { SftpModalOption } from 'app/store/sftpStore';
import { SftpCatalogMode } from 'app/services/SftpService/config';
import { Stack } from 'shared/lib/Stack';
import { SftpCatalogModeProps } from 'widgets/SftpModules/SftpCatalog';

interface SftpSelectHostCatalogProps extends SftpCatalogModeProps {
    className?: string,
    onClose?: () => void,
}

export function SftpSelectHostCatalog ({ className, onClose, mode }: SftpSelectHostCatalogProps) {
    const { t } = useTranslation('translation');
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
        const modalOptions: SftpModalOption = {
            errorState: false,
            newFolderState: false,
            deleteState: false,
            renameState: false,
            downloadState: false,
            uploadState: false,
            sendState: false
        }

        const newHostInstance = {
            server: serverData,
            isLoad: false,
            sftpFilesOption: {
                filterOptions: {},
                historyPrevPaths: new Stack<string>(),
                historyNextPaths: new Stack<string>()
            },
            modalOption: modalOptions
        }

        if (mode === SftpCatalogMode.First) {
            if (sftpStore.firstSelectedHost?.sftpHub) {
                sftpStore.firstSelectedHost.sftpHub.closeConnection();
            }

            sftpStore.firstSelectedHost = newHostInstance;
        }

        if (mode === SftpCatalogMode.Second) {
            if (sftpStore.secondSelectedHost?.sftpHub) {
                sftpStore.secondSelectedHost.sftpHub.closeConnection();
            }

            sftpStore.secondSelectedHost = newHostInstance;
        }

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
