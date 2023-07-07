import type { ThemeVars } from "../types/store";
import { rgba } from "../lib/utils";

export const getStyles = (themeVars : ThemeVars) => {

    const { Color, Spacing, FontFamily, FontSize, Border } = themeVars;

    return {
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
            fontFamily: FontFamily.sans,
            fontSize: FontSize.base
        },
        textError: {
            color: Color.error,
            fontFamily: FontFamily.sans
        },
        textInputContainer: {
            fontFamily: FontFamily.sans,
            backgroundColor: Color.base,
            color: Color.baseContrast,
            minHeight: 48
        },
        textInputText: {
            fontFamily: FontFamily.sans,
            fontSize: FontSize.base,
            color: Color.baseContrast,
        },
        textInputMultiline: {
            fontFamily: FontFamily.sans,
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
        textMedium: {
            fontSize: FontSize.medium,
            fontFamily: FontFamily.sans,
            color: Color.baseContrast
        },
        textLarge: {
            fontSize: FontSize.large,
            fontFamily: FontFamily.sans,
            color: Color.baseContrast
        },
        textXlarge: {
            fontSize: FontSize.xlarge,
            fontFamily: FontFamily.sans,
            color: Color.baseContrast
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
            alignItems: 'center',
        },
        listItemTitle: {
            color: Color.baseContrast,
            fontFamily: FontFamily.sans,
            fontSize: FontSize.medium
        },
        addressText: {
            fontFamily: FontFamily.sans,
            fontSize: FontSize.small,
            color: Color.secondary,
        },
        addressContainer: {
            backgroundColor: rgba(Color.secondary, 0.1),
            borderRadius: Border.radius,
            fontFamily: FontFamily.sans,
            fontSize: FontSize.small,
            flexDirection: 'row',
            columnGap: Spacing.small,
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 4,
            paddingVertical: 2
        },
        symbol: {
            fontFamily: FontFamily.sans,
            fontSize: FontSize.medium,
            color: Color.baseContrast,
            fontWeight: 'bold',
        },
        rowGapSmall: {
            rowGap: Spacing.small
        },
        rowGapBase: {
            rowGap: Spacing.base
        },
        rowGapMedium: {
            rowGap: Spacing.medium
        },
        rowGapLarge: {
            rowGap: Spacing.large
        },
        columnGapSmall: {
            columnGap: Spacing.small
        },
        columnGapBase: {
            columnGap: Spacing.base
        },
        columnGapMedium: {
            columnGap: Spacing.medium
        },
        columnGapLarge: {
            columnGap: Spacing.large
        },
        paddingSmall: {
            padding: Spacing.small,
        },
        paddingBase: {
            padding: Spacing.base,
        },
        paddingMedium: {
            padding: Spacing.medium,
        },
        paddingLarge: {
            padding: Spacing.large,
        },
        paddingHorizontalSmall: {
            paddingHorizontal: Spacing.small,
        },
        paddingHorizontalBase: {
            paddingHorizontal: Spacing.base,
        },
        paddingHorizontalMedium: {
            paddingHorizontal: Spacing.medium,
        },
        paddingHorizontalLarge: {
            paddingHorizontal: Spacing.large,
        },
        marginSmall: {
            margin: Spacing.small,
        },
        marginBase: {
            margin: Spacing.base,
        },
        marginMedium: {
            margin: Spacing.medium,
        },
        marginLarge: {
            margin: Spacing.large,
        },
        marginHorizontalSmall: {
            marginHorizontal: Spacing.small,
        },
        marginHorizontalBase: {
            marginHorizontal: Spacing.base,
        },
        marginHorizontalMedium: {
            marginHorizontal: Spacing.medium,
        },
        marginHorizontalLarge: {
            marginHorizontal: Spacing.large,
        },
        flex1: {
            flex: 1
        },
        directionRow: {
            flexDirection: 'row'
        },
        directionColumn: {
            flexDirection: 'column'
        },
        alignCenterColumn: {
            alignItems: 'center'
        },
        alignCenterRow: {
            justifyContent: 'center'
        },
        alignSpaceBetweenRow: {
            justifyContent: 'space-between'
        },
        alignSpaceBetweenColumn: {
            alignItems: 'space-between'
        },
        sectionTitle: {
            fontFamily: FontFamily.sans,
            fontSize: FontSize.small,
            color: rgba(Color.baseContrast, 0.6),
        }
    }

}
