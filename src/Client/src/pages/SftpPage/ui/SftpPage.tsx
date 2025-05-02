import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpPage.module.scss';
import { observer } from 'mobx-react-lite';
import ReactSplit, { SplitDirection } from '@devbookhq/splitter';
import { SftpCatalog } from 'widgets/SftpModules/SftpCatalog';
import { useRef, useState } from 'react';
import sftpStore, { SftpScreenSplitMode } from 'app/store/sftpStore';
import { Select, SelectedItem, SelectItem } from 'shared/ui/Select';
import { SelectPosition } from 'shared/ui/Select/ui/Select';

export interface ChangedWidthProp {
    changedWidth?: number
}

interface SftpPageProps {
    className?: string;
}

function SftpPage ({ className }: SftpPageProps) {
    const sftpPageRef = useRef<HTMLDivElement>(null);

    const squaresIcon = (
        <div className={classNames(style.squares_icon)}>
            <div/>
            <div/>
            <div/>
            <div/>
        </div>
    );

    const splitMods = Object.values(SftpScreenSplitMode)
        .filter((value) => typeof value === 'number')
        .map((value) => ({
            id: value as number, // id остаётся числом
            title: value === 1 ? 'No split' : `${value} columns`
        }));

    const selectedMode = splitMods.find((p) => p.id === sftpStore.windowOption);

    const onChangeSplitModeHandler = (selectedItem: SelectedItem) => {
        sftpStore.windowOption = Number(selectedItem.id) as SftpScreenSplitMode;
    }

    return (
        <div className={classNames(style.sftpPage, {}, [className])} ref={sftpPageRef}>
            <ReactSplit
                gutterClassName={classNames(style.gutter)}
                draggerClassName={classNames(style.dragger)}
                direction={SplitDirection.Horizontal}
                minWidths={[390, 390, 390, 390]}
                // eslint-disable-next-line no-return-assign
                onResizeFinished={(_, __) => sftpStore.editableWidthSplit = !sftpStore.editableWidthSplit}
            >
                {sftpStore.hosts.map((_, index) =>
                    <SftpCatalog key={index} windowsIndex={index} />
                )}
            </ReactSplit>
            <div className={classNames(style.footer)}>
                <div className={classNames(style.select_split_mode)}>
                    <Select
                        placeholder={'sss'}
                        position={SelectPosition.RIGHT_TOP}
                        className={classNames(style.screen_split_select)}
                        isLite={true}
                        icon={squaresIcon}
                        onChange={onChangeSplitModeHandler}
                        selectedItem={{ id: selectedMode?.id.toString(), title: selectedMode?.title }}
                        widthOptionsPanel={160}
                    >
                        {splitMods.map(mode =>
                            <SelectItem
                                selectedItem={{ id: mode.id.toString(), title: mode.title }}
                                isSelected={mode.id === selectedMode?.id}
                                key={mode.id}
                            />
                        )}
                    </Select>
                </div>

            </div>
        </div>
    );
}

export default observer(SftpPage);
