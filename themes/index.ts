import type { Theme } from "../types/store";
import { getTheme as getDark } from "./dark";
import { getTheme as getLight } from "./light";

const themes = {
    light: getLight(),
    dark: getDark()
};

export const getTheme = (theme: string) : Theme => {
    if (!themes.hasOwnProperty(theme)) {
        throw new Error("Theme not found");
    }

    return themes[theme as keyof typeof themes];
}

export default themes;