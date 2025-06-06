import { createContext } from 'react';
import { Theme } from '../Theme/ThemeContext';
import { SelectedItem } from 'shared/ui/Select';

export interface SelectContextProps {
    visible?: boolean,
    selectedElement?: SelectedItem,
    setSelected?: (selectedItem: SelectedItem) => void,
    searchValue?: string

}

export const SelectContext = createContext<SelectContextProps>({});
