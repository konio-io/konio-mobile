import { Text, Screen, Wrapper } from "../components";
import { useTheme, useI18n } from "../hooks";

export default () => {
    const theme = useTheme();
    const { Color } = theme.vars;
    const i18n = useI18n();

    return (
        <Screen>
            <Wrapper type="full">
                <Text style={{ color: Color.baseContrast }}>{i18n.t('available_soon')}</Text>
            </Wrapper>
        </Screen>
    );
};