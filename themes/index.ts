import type { Theme } from "../types/store";
import { getTheme as getDark } from "./dark";
import { getTheme as getLight } from "./light";

export const Themes = {
    light: getLight(),
    dark: getDark()
};

export const getTheme = (theme: string) : Theme => {
    if (!Themes.hasOwnProperty(theme)) {
        throw new Error("Theme not found");
    }

    return Themes[theme as keyof typeof Themes];
}

export default Themes;