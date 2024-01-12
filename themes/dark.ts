import type { Theme, ThemeVars } from "../types/ui";
import { getStyles } from "./baseStyles";

export const getTheme = () : Theme => {

    const Spacing = {
        mini: 5,
        small: 7,
        base: 15,
        medium: 25,
        large: 35
    };

    const FontSize = {
        small: 13,
        base: 16,
        medium: 18,
        large: 24,
        xlarge: 28
    };

    const FontFamily = {
        sans: 'Poppins'
    };

    const Color = {
        base: 'rgba(9,9,10,1)',
        baseContrast: 'rgba(220,220,220,1)',
        primary: 'rgba(120,1,246,1)',
        primaryContrast: 'rgba(220,220,220,1)',
        error: 'rgba(204,63,63,1)',
        warning: 'rgba(255,142,36,1)',
        success: 'rgba(94,184,59,1)',
        secondary: 'rgba(0,103,255,1)'
    };

    const Border = {
        color: 'rgba(70,70,70,1)',
        width: 1,
        radius: 20
    };

    const vars : ThemeVars = { Spacing, FontSize, FontFamily, Color, Border };
    const styles = getStyles(vars);

    return {
        name: 'dark',
        vars,
        styles,
        statusBarStyle: 'light'
    };
}