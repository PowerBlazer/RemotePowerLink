import { classNames } from 'shared/lib/classNames/classNames';
import style from './NavbarSftp.module.scss';
import { observer } from 'mobx-react-lite';
import { Button } from 'shared/ui/Button/Button';
import { HostService } from 'app/services/hostService';
import sftpStore, { MenuMode } from 'app/store/sftpStore';
import { useTranslation } from 'react-i18next';
import ArrowIcon from 'shared/assets/icons/arrow-prev.svg';
import { SearchInput } from 'features/SearchInput';
import { SftpCatalogSwitcher } from 'features/SftpModules/SftpCatalogSwitcher';
import { SftpCatalogNavigation } from 'features/SftpModules/SftpCatalogNavigation';
import { SftpMenu } from 'widgets/SftpModules/SftpMenu';
import { useMemo, useRef, useState } from 'react';
import { SftpCatalogModeProps } from 'widgets/SftpModules/SftpCatalog';
import { DefaultServerIcon } from 'shared/ui/DefaultServerIcon'

interface NavbarSftpProps extends SftpCatalogModeProps {
    className?: string,
    onOpenCatalog: () => void
}

function NavbarSftp ({ className, mode, onOpenCatalog }: NavbarSftpProps) {
    const { t } = useTranslation('translation');
    const selectedHost = sftpStore.getHostInMode(mode);

    const selectedTitle = selectedHost?.sftpFilesOption.filterOptions.title || '';
    const server = selectedHost?.server;

    const [isVisibleMenu, setVisibleMenu] = useState<boolean>(false);
    const actionButtonRef = useRef<HTMLButtonElement>(null)
    const onChangeSearchHandler = (value: string) => {
        sftpStore.setSftpFilterOptions(mode, {
            ...selectedHost?.sftpFilesOption.filterOptions,
            title: value
        })
    }

    const onVisibleMenuHandler = () => {
        if (selectedHost) {
            selectedHost.menuOption = {
                menuMode: MenuMode.Default,
                isVisible: false
            }

            setVisibleMenu(value => !value)
        }
    }

    return (
        <div className={classNames(style.navbarSftp, {}, [className])}>
            <div className={classNames(style.navbar_header)}>
                <Button className={classNames(style.change_host)} onClick={onOpenCatalog}>
                    {server.systemTypeIcon
                        ? <img
                            className={classNames(style.server_icon)}
                            alt={'server_icon'}
                            src={`${HostService._resourceHost}${server.systemTypeIcon}`}
                            width={22}
                            height={22}
                        />
                        : <DefaultServerIcon width={18} height={18}/>}
                    <h4 className={classNames(style.server_title)}>{server.title}</h4>
                </Button>
                <div className={classNames(style.tools)}>
                    <div className={classNames(style.action_panel)}>
                        <Button className={classNames(style.actions)} onClick={onVisibleMenuHandler} ref={actionButtonRef}>
                            {t('Действия')}
                            <div className={classNames(style.arrow_icon, { [style.rotate]: isVisibleMenu })}>
                                <ArrowIcon width={18} height={18}/>
                            </div>
                        </Button>
                        <SftpMenu
                            mode={mode}
                            isPosition={false}
                            isVisible={isVisibleMenu}
                            className={classNames(style.action_menu)}
                            ref={actionButtonRef}
                            onClose={() => { setVisibleMenu(false); }}
                        />
                    </div>

                </div>
            </div>
            <div className={classNames(style.catalog_tools)}>
                <SftpCatalogSwitcher mode={mode}/>
                <SftpCatalogNavigation mode={mode}/>
            </div>
            <SearchInput
                className={classNames(style.search_input)}
                onChange={(value) => { onChangeSearchHandler(value); }}
                value={selectedTitle}
            />
        </div>
    );
}

export default observer(NavbarSftp)
