import { observer } from 'mobx-react-lite';
import style from './Terminal.module.scss';
import { classNames } from 'shared/lib/classNames/classNames';
import terminalStore, { TerminalScreenSplitMode } from 'app/store/terminalStore';
import { Select, SelectedItem, SelectItem } from 'shared/ui/Select';
import { SelectPosition } from 'shared/ui/Select/ui/Select';
import { TerminalCatalog } from 'widgets/TerminalModules/TerminalCatalog';
import ReactSplit, { SplitDirection } from '@devbookhq/splitter';
import { useCallback, useMemo } from 'react';
import userStore from 'app/store/userStore';
import { Loader } from 'shared/ui/Loader/Loader';

function TerminalPage () {
    const squaresIcon = (
        <div className={classNames(style.squares_icon)}>
            <div/>
            <div/>
            <div/>
            <div/>
        </div>
    );

    const splitMods = useMemo(() =>
        Object.values(TerminalScreenSplitMode)
            .filter((value) => typeof value === 'number')
            .map((value) => ({
                id: value as number,
                title: value === 1 ? 'No split' : `${value} columns`
            })),
    []
    )

    const selectedMode = useMemo(() =>
        splitMods.find(p => p.id === terminalStore.selectedMode), [terminalStore.selectedMode])

    const onChangeSplitModeHandler = useCallback(
        (selectedItem: SelectedItem) => {
            terminalStore.selectedMode = Number(selectedItem.id) as TerminalScreenSplitMode;
            terminalStore.initializeGroupSessions(terminalStore.selectedMode);
        },
        [terminalStore.selectedMode]
    );

    if (userStore.isLoadData || terminalStore.isLoad) {
        return (
            <div className={classNames(style.terminalPage, {}, [style.information])}>
                <Loader className={classNames(style.loader)}/>
            </div>
        )
    }

    return (
        <div className={classNames(style.terminalPage)}>
            <ReactSplit
                gutterClassName={classNames(style.gutter)}
                draggerClassName={classNames(style.dragger)}
                direction={SplitDirection.Horizontal}
                minWidths={[390, 390, 390, 390]}
            >
                {terminalStore.groupsTerminalSessions?.length > 0
                    ? terminalStore.groupsTerminalSessions.map((groupSessions) =>
                        <TerminalCatalog key={groupSessions.index} index={groupSessions.index} />
                    )
                    : <div/>
                }

            </ReactSplit>

            <div className={classNames(style.footer)}>
                <div className={classNames(style.select_split_mode)}>
                    <Select
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
    )
}

export default observer(TerminalPage);
