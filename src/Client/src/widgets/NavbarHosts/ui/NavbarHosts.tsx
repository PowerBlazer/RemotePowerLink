import { classNames } from 'shared/lib/classNames/classNames';
import style from './NavbarHosts.module.scss';
import { useTranslation } from 'react-i18next';
import { Button } from 'shared/ui/Button/Button';
import ServerIcon from 'shared/assets/icons/navbar/server.svg';
import DoubleArrow from 'shared/assets/icons/double-arrow.svg';
import Card from 'shared/assets/icons/navbar/card.svg';
import sidebarStore from 'app/store/sidebarStore';
import { SidebarNewHost } from 'widgets/SidebarNewHost';
import { SidebarNewProxy } from 'widgets/SidebarNewProxy';
import SidebarNewIdentity from 'widgets/SidebarNewIdentity/ui/SidebarNewIdentity';
import { observer } from 'mobx-react-lite';

interface NavbarHostsProps {
    className?: string;
}

function NavbarHosts ({ className }: NavbarHostsProps) {
    const { t } = useTranslation('translation');

    const createNewHostHandler = async () => {
        await sidebarStore.setSidebar({
            name: 'SidebarNewHost',
            sidebar: <SidebarNewHost isMain={true}/>
        });
    }

    const createNewProxy = async () => {
        await sidebarStore.setSidebar({
            name: 'SidebarNewProxy',
            sidebar: <SidebarNewProxy isMain={true}/>
        })
    }

    const createNewIdentity = async () => {
        await sidebarStore.setSidebar({
            name: 'SidebarNewIdentity',
            sidebar: <SidebarNewIdentity isMain={true}/>
        })
    }

    return (
        <div className={classNames(style.navbarHosts, {}, [className])}>
            <div className={classNames(style.search_block)}>
                <input type={'text'} className={classNames(style.search)} placeholder={t('Поиск серверов или ssh root@hostname...')}/>
                <Button className={classNames(style.connect_button, {}, [])}>{t('Подключиться')}</Button>
            </div>

            <div className={classNames(style.control_panel)}>
                <div className={classNames(style.tools_panel)}>
                    <Button
                        className={classNames(style.newhost_button, {}, [style.tool_button])}
                        onClick={createNewHostHandler}
                    >
                        <ServerIcon width={'15px'} height={'15px'}/>
                        {t('Новый сервер')}
                    </Button>

                    <Button
                        className={classNames(style.newproxy_button, {}, [style.tool_button])}
                        onClick={createNewProxy}
                    >
                        <DoubleArrow width={'15px'} height={'15px'}/>
                        {t('Новый прокси')}
                    </Button>

                    <Button
                        className={classNames(style.newidentity_button, {}, [style.tool_button])}
                        onClick={createNewIdentity}
                    >
                        <Card width={'15px'} height={'15px'}/>
                        {t('Новый иденитификатор')}
                    </Button>
                </div>
                <div className={classNames(style.filter_tool_panel)}>

                </div>
            </div>
        </div>
    );
}

export default observer(NavbarHosts);
