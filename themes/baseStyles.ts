import type { ThemeVars } from "../types/ui";
import { rgba } from "../lib/utils";

export const getStyles = (themeVars : ThemeVars) => {

    const { Color, Spacing, FontFamily, FontSize, Border } = themeVars;

    return {
        link: {
            color: Color.primary,
            fontFamily: FontFamily.sans,
            fontSize: FontSize.base,
        },
        separator: {
            height: Border.width,
            backgroundColor: Border.color,
        },
        textCenter: {
            textAlign: 'center'
        },
        textRight: {
            textAlign: 'right'
        },
        text: {
            color: Color.baseContrast,
            fontFamily: FontFamily.sans,
            fontSize: FontSize.base,
        },
        textError: {
            color: Color.error,
            fontFamily: FontFamily.sans,
            fontSize: FontSize.base
        },
        textSuccess: {
            color: Color.success,
            fontFamily: FontFamily.sans,
            fontSize: FontSize.base
        },
        textInputContainer: {
            fontFamily: FontFamily.sans,
            backgroundColor: rgba(Color.baseContrast, 0.015),
            color: Color.baseContrast,
            borderRadius: Border.radius,
            padding: Spacing.base
        },
        textInputText: {
            fontFamily: FontFamily.sans,
            fontSize: FontSize.base,
            color: Color.baseContrast,
            paddingTop: 0,
            paddingBottom: 0
        },
        textInputDisabled: {
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
        textBold: {
            fontFamily: FontFamily.sans+'_bold'
        },
        inputContainer: {
            rowGap: Spacing.mini
        },
        listItemContainer: {
            flexDirection: 'row',
            columnGap: Spacing.base,
            padding: Spacing.base,
            justifyContent: 'space-between',
            alignItems: 'center',
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
            paddingHorizontal: 6,
            paddingVertical: 2
        },
        symbol: {
            fontFamily: FontFamily.sans+'_bold',
            fontSize: FontSize.medium,
            color: Color.baseContrast,
            //fontWeight: 'bold',
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
        paddingVerticalSmall: {
            paddingVertical: Spacing.small,
        },
        paddingVerticalBase: {
            paddingVertical: Spacing.base,
        },
        paddingVerticalMedium: {
            paddingVertical: Spacing.medium,
        },
        paddingVerticalLarge: {
            paddingVertical: Spacing.large,
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
        alignEndRow: {
            justifyContent: 'flex-end'
        },
        alignEndColumn: {
            alignItems: 'flex-end'
        },
        sectionTitle: {
            fontFamily: FontFamily.sans,
            fontSize: FontSize.small,
            color: rgba(Color.baseContrast, 0.6),
        }
    }

}
