import type { Theme, ThemeVars } from "../types/store";
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
        base: 14,
        small: 12,
        medium: 16,
        large: 20
    };

    const FontFamily = {
        sans: 'Poppins'
    };

    const Color = {
        base: 'rgba(255,255,255,1)',
        baseContrast: 'rgba(10,10,10,1)',
        primary: 'rgba(111,0,246,1)',
        primaryContrast: 'rgba(244,255,255,1)',
        error: 'rgba(204,63,63,1)',
        warning: 'rgba(255,142,36,1)',
        success: 'rgba(94,184,59,1)'
    };

    const Border = {
        color: 'rgba(10,10,10,0.1)',
        width: 1,
        radius: 4
    };

    const vars : ThemeVars = { Spacing, FontSize, FontFamily, Color, Border };
    const styles = getStyles(vars);

    return {
        name: 'light',
        vars,
        styles
    };
}