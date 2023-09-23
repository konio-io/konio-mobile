import { StatusBarStyle } from "expo-status-bar"

export type FlatListItem = {
    title: string,
    name: string,
    description: string,
    onPress: Function
}

export type ThemeVars = {
    Spacing: {
        mini: number,
        small: number,
        base: number,
        medium: number,
        large: number
    },
    FontSize: {
        base: number,
        small: number,
        medium: number,
        large: number,
        xlarge: number
    },
    FontFamily: {
        sans: string
    },
    Color: {
        base: string
        baseContrast: string
        primary: string
        primaryContrast: string
        error: string
        warning: string
        success: string,
        secondary: string
    },
    Border: {
        color: string,
        width: number,
        radius: number
    }
}

export type Theme = {
    name: string,
    vars: ThemeVars,
    styles: any,
    statusBarStyle: StatusBarStyle
}

export interface Dapp {
    icon: string,
    name: string,
    summary: string,
    description: string,
    url: string,
    tags: Array<string>,
    compatible: boolean
}