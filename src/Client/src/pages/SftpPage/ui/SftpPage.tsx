import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpPage.module.scss';
import { observer } from 'mobx-react-lite';
import ReactSplit, { SplitDirection } from '@devbookhq/splitter';
import { SftpCatalog } from 'widgets/SftpCatalog';
import { useRef } from 'react';
import { SftpCatalogMode } from 'app/services/SftpService/config';
import sftpStore from 'app/store/sftpStore';
import { SftpNotificationPanel } from 'widgets/SftpNotificationPanel';

export interface ChangedWidthProp {
    changedWidth?: number
}

interface SftpPageProps {
    className?: string;
}

function SftpPage ({ className }: SftpPageProps) {
    const sftpPageRef = useRef<HTMLDivElement>(null);

    return (
        <div className={classNames(style.sftpPage, {}, [className])} ref={sftpPageRef}>
            <ReactSplit
                gutterClassName={classNames(style.gutter)}
                draggerClassName={classNames(style.dragger)}
                direction={SplitDirection.Horizontal}
                minWidths={[390, 390]}
                // eslint-disable-next-line no-return-assign
                onResizeFinished={(_, __) => sftpStore.editableWidthSplit = !sftpStore.editableWidthSplit}
            >
                <SftpCatalog mode={SftpCatalogMode.First} />
                <SftpCatalog mode={SftpCatalogMode.Second} />
            </ReactSplit>
        </div>
    );
}
export default observer(SftpPage);
