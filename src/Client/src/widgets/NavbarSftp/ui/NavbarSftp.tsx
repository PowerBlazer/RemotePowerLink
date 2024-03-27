import { classNames } from 'shared/lib/classNames/classNames';
import style from './NavbarSftp.module.scss';
import { observer } from 'mobx-react-lite';
import { Button } from 'shared/ui/Button/Button';
import { HostService } from 'app/services/hostService';
import sftpStore from 'app/store/sftpStore';
import { useTranslation } from 'react-i18next';
import ArrowIcon from 'shared/assets/icons/arrow-prev.svg';
import { useEffect, useState } from 'react';
import { SearchInput } from 'features/SearchInput';
import { SftpCatalogSwitcher } from 'features/SftpCatalogSwitcher';
import { Loader } from 'shared/ui/Loader/Loader';
import { SftpCatalogMode } from 'app/services/SftpService/config/sftpConfig';

interface NavbarSftpProps {
    className?: string,
    mode: SftpCatalogMode,
    onOpenCatalog: () => void
}

function NavbarSftp ({ className, mode, onOpenCatalog }: NavbarSftpProps) {
    const { t } = useTranslation('translation');

    const selectedHost = mode === SftpCatalogMode.First
        ? sftpStore.firstSelectedHost
        : sftpStore.secondSelectedHost;

    const selectedFilterOptions = mode === SftpCatalogMode.First
        ? sftpStore.firstFilterOptions
        : sftpStore.secondFilterOptions;

    const server = selectedHost?.server;

    const onChangeSearchHandler = (value: string) => {
        sftpStore.setSftpFilterOptions(mode, {
            ...selectedFilterOptions,
            title: value
        })
    }

    return (
        <div className={classNames(style.navbarSftp, {}, [className])}>
            <div className={classNames(style.navbar_header)}>
                {selectedHost?.isLoad
                    ? <Loader className={classNames(style.loader)}/>
                    : <Button className={classNames(style.change_host)} onClick={onOpenCatalog}>
                        <img
                            className={classNames(style.server_icon)}
                            alt={'server_icon'}
                            src={`${HostService._apiHost}${server.systemTypeIcon}`}
                            width={22}
                            height={22}
                        />
                        <h4 className={classNames(style.server_title)}>{server.title}</h4>
                    </Button>
                }
                <div className={classNames(style.tools)}>
                    <div className={classNames(style.actions)}>
                        {t('Действия')}
                        <div className={classNames(style.arrow_icon)}>
                            <ArrowIcon width={18} height={18}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className={classNames(style.catalog_tools)}>
                <SftpCatalogSwitcher mode={mode}/>
                {selectedHost?.sftpFileList?.currentPath}
            </div>
            <SearchInput 
                className={classNames(style.search_input)} 
                onChange={(value) => { onChangeSearchHandler(value); }}
                value={selectedFilterOptions.title}
            />
        </div>
    );
}

export default observer(NavbarSftp)
