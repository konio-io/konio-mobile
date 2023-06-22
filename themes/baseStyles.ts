import type { ThemeVars } from "../types/store";
import { rgba } from "../lib/utils";

export const getStyles = (themeVars : ThemeVars) => {

    const { Color, Spacing, FontFamily, FontSize, Border } = themeVars;

    return {
        wrapperFull: {
            flex: 1,
            backgroundColor: Color.base
        },
        wrapper: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Color.base,
            padding: Spacing.base
        },
        main: {
            width: 300,
            rowGap: Spacing.medium
        },
        link: {
            color: Color.primary,
            fontFamily: FontFamily.sans
        },
        separator: {
            height: Border.width,
            backgroundColor: Border.color,
        },
        textCenter: {
            textAlign: 'center'
        },
        text: {
            color: Color.baseContrast,
            fontFamily: FontFamily.sans
        },
        textError: {
            color: Color.error,
            fontFamily: FontFamily.sans
        },
        textInput: {
            borderWidth: Border.width,
            borderColor: Border.color,
            borderRadius: Border.radius,
            fontFamily: FontFamily.sans,
            padding: Spacing.small,
            backgroundColor: Color.base,
            color: Color.baseContrast,
            minHeight: 48
        },
        textInputMultiline: {
            borderWidth: Border.width,
            borderColor: Border.color,
            borderRadius: Border.radius,
            fontFamily: FontFamily.sans,
            padding: Spacing.small,
            backgroundColor: Color.base,
            color: Color.baseContrast,
            minHeight: 100
        },
        textInputDisabled: {
            borderWidth: Border.width,
            borderColor: Border.color,
            fontFamily: FontFamily.sans,
            padding: 5,
            color: rgba(Color.baseContrast, 0.6)
        },
        textInputCaption: {
            padding: 2,
            color: rgba(Color.baseContrast, 0.6),
            fontSize: FontSize.small,
            fontFamily: FontFamily.sans
        },
        textSmall: {
            color: rgba(Color.baseContrast, 0.6),
            fontSize: FontSize.small,
            fontFamily: FontFamily.sans
        },
        inputContainer: {
            rowGap: Spacing.mini
        },
        listItemContainer: {
            flexDirection: 'row',
            columnGap: Spacing.base,
            padding: Spacing.base,
            backgroundColor: Color.base,
            justifyContent: 'space-between',
        },
        textTitle: {
            fontSize: FontSize.large,
            fontFamily: FontFamily.sans,
            color: Color.baseContrast,
        },
        textTitleMedium: {
            fontSize: FontSize.medium,
            fontFamily: FontFamily.sans,
            color: Color.baseContrast,
        },
        listItemTitle: {
            color: Color.baseContrast,
            fontFamily: FontFamily.sans,
            fontSize: FontSize.medium
        }
    }

}
