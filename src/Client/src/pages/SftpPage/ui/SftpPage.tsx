import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpPage.module.scss';
import { observer } from 'mobx-react-lite';
import ReactSplit, { SplitDirection } from '@devbookhq/splitter';
import { SftpCatalog } from 'widgets/SftpCatalog';
import { useEffect, useRef, useState } from 'react';
import { SftpCatalogMode } from 'app/services/SftpService/config/sftpConfig';

interface SftpPageProps {
    className?: string;
}

function SftpPage ({ className }: SftpPageProps) {
    const [minSplitWidth, setMinWidth] = useState(450);
    const sftpPageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (sftpPageRef.current) {
            const width = sftpPageRef.current.offsetWidth;
            const thirtyPercentWidth = width * 0.3;

            if (thirtyPercentWidth >= 300) {
                setMinWidth(thirtyPercentWidth);
            }
        }
    }, [sftpPageRef.current]);

    return (
        <div className={classNames(style.sftpPage, {}, [className])} ref={sftpPageRef}>
            <ReactSplit
                gutterClassName={classNames(style.gutter)}
                draggerClassName={classNames(style.dragger)}
                direction={SplitDirection.Horizontal}
                minWidths={[minSplitWidth, minSplitWidth]}
            >
                <SftpCatalog mode={SftpCatalogMode.First}/>
                <SftpCatalog mode={SftpCatalogMode.Second}/>
            </ReactSplit>
        </div>
    );
}

export default observer(SftpPage);
