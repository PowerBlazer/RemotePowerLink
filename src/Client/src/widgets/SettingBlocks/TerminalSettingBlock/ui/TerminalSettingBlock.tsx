import {observer} from "mobx-react-lite";
import style from './TerminalSettingBlock.module.scss';
import {classNames} from "shared/lib/classNames/classNames";
import {Button, ThemeButton} from "shared/ui/Button/Button";
import {Input} from "shared/ui/Input";
import {SettingBlock} from "features/SettingBlock";
import {useTranslation} from "react-i18next";
import {ChangeEvent, useEffect, useMemo, useState} from "react";
import terminalStore from "app/store/terminalStore";
import {TerminalSetting, TerminalTheme} from "app/services/TerminalService/config";
import {ButtonLoader} from "shared/ui/ButtonLoader";
import {TerminalService} from "app/services/TerminalService/terminalService";
import toast from "react-hot-toast";
import {SearchInput} from "features/SearchInput";
import {ThemeCard} from "features/TerminalModules/ThemeCard";

interface TerminalSettingBlockProps {
    className?: string;
}

function TerminalSettingBlock({ className }: TerminalSettingBlockProps) {
    const { t } = useTranslation('translation');
    
    const [terminalSetting, setTerminalSetting] = useState<TerminalSetting>(terminalStore.terminalSetting);
    const [themeSearchValue, setThemeSearchValue] = useState<string>('');
    const [themeList, setThemeList] = useState<TerminalTheme[]>([]);
    
    const themeCompare = (a: TerminalTheme, b: TerminalTheme) => {
        if(a.id === terminalSetting?.terminalThemeId){
            return -1;
        }

        if(b.id === terminalSetting?.terminalThemeId){
            return 1;
        }

        return 0;
    }
    
    const onChangeFontSizeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const number = Number(e.target.value)
        
        if(!isNaN(number)){
            terminalSetting.fontSize = number;
        }
    }
    
    const onBlurFontSizeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.value.length === 0 || Number(e.target.value) <= 8) {
            terminalSetting.fontSize = 8;
            return;
        }
        
        if(Number(e.target.value) >= 22) {
            terminalSetting.fontSize = 22;
        }
    }

    const onChangeThemeSearchValue = (value:string) => {
        setThemeSearchValue(value);

        const themes = terminalStore.terminalThemes
            .filter(p=> p.name.toLowerCase().includes(value.toLowerCase()))
            

        setThemeList(themes);
    }
    
    const onClickThemeCard = (themeCard: TerminalTheme) => {
        terminalSetting.terminalThemeId = themeCard.id;
        
        setTerminalSetting(terminalSetting);
    }
    
    const onSaveSettingAction = async () => {
        const updateResult = await TerminalService.updateSetting({
            fontSize: terminalSetting.fontSize,
            terminalThemeId: terminalSetting.terminalThemeId,
        });
        
        if(updateResult.isSuccess){
            terminalStore.terminalSetting = updateResult.result;
            
            toast.success(t('Успешно сохранено'));
        }
        
        if(!updateResult.isSuccess){
            toast.error(Object.values(updateResult.errors).join('\n'));
        }
    }
    
    const themeListContainer = useMemo(() => {
        return (
            <div className={classNames(style.list_inner)}>
                {themeList.map(themeItem => (
                    <ThemeCard
                        terminalTheme={themeItem}
                        isSelected={themeItem.id === terminalSetting?.terminalThemeId}
                        key={themeItem.id}
                        onClick={() => onClickThemeCard(themeItem)}
                    />
                ))}
            </div>
        )
    },[terminalSetting?.terminalThemeId, themeList])

    useEffect(() => {
        setTerminalSetting(terminalStore.terminalSetting);
    }, [terminalStore.terminalSetting]);

    useEffect(() => {
        const sortedThemes = terminalStore.terminalThemes.sort(themeCompare);

        setThemeList(sortedThemes);
    }, [terminalStore.terminalThemes]);

    return (
        <SettingBlock className={classNames(style.terminal_setting, {}, [className])} headerName={t('Настройки терминала')}>
            <div className={classNames(style.font_size)}>
                <div className={classNames(style.label)}>{t('Размер текста')}</div>
                <div className={classNames(style.editor)}>
                    <Button
                        className={classNames(style.minus, {}, [style.size_editor])}
                        onClick={() => terminalSetting.fontSize--}
                    >
                        -
                    </Button>
                    <Input
                        type='text'
                        className={classNames(style.editor_input)}
                        value={terminalSetting?.fontSize ?? 0}
                        onChange={onChangeFontSizeHandler}
                        onBlur={onBlurFontSizeHandler}
                    />
                    <Button
                        className={classNames(style.plus, {}, [style.size_editor])}
                        onClick={() => terminalSetting.fontSize++}
                    >
                        +
                    </Button>
                </div>
            </div>
            
            <div className={classNames(style.theme_list)}>
                <div className={classNames(style.theme_list_header)}>
                    <div className={classNames(style.label)}>{t('Тема терминала')}</div>
                    <SearchInput 
                        className={classNames(style.search_input)}
                        onChange={onChangeThemeSearchValue}
                        value={themeSearchValue}
                    />
                </div>

                <div className={classNames(style.theme_list)}>
                    {themeListContainer}
                </div>
            </div>

            <div className={classNames(style.save_block)}>
                <ButtonLoader
                    theme={ThemeButton.PRIMARY}
                    className={classNames(style.save_button)}
                    actionAsync={onSaveSettingAction}>
                    {t('Сохранить')}
                </ButtonLoader>
            </div>
        </SettingBlock>
    )
}





export default observer(TerminalSettingBlock);