import { SheetProps } from "react-native-actions-sheet";
import ActionSheet from "./ActionSheet";
import { Dapp, Theme } from "../types/ui";
import { Button, DappLogo, Text } from "../components"
import { useI18n, useTheme } from "../hooks";
import { View, StyleSheet, Linking} from "react-native";
import { Feather } from '@expo/vector-icons';

export default (props: SheetProps<{
    dapp: Dapp
}>) => {
    const theme = useTheme();
    const styles = createStyles(theme);
    const i18n = useI18n();

    if (!props.payload?.dapp) {
        return <></>;
    }

    return (
        <ActionSheet id={props.sheetId} containerStyle={{...styles.paddingBase, ...styles.rowGapBase}}>

            <View style={{...styles.alignCenterColumn, ...styles.rowGapSmall}}>
                <DappLogo dapp={props.payload?.dapp} size={100}/>
            </View>

            <Text>{props.payload?.dapp.description}</Text>

            { 
                props.payload?.dapp.url !== undefined &&
                <Button 
                    type="primary" 
                    title={i18n.t('open')} 
                    onPress={() => Linking.openURL(props.payload?.dapp.url ?? 'https://konio.io')}
                    icon={(<Feather name="external-link"/>)}
                />
            }
        </ActionSheet>
    );
}

const createStyles = (theme: Theme) => {
    const { Border } = theme.vars;

    return StyleSheet.create({
        ...theme.styles,
        itemIcon: {
            padding: 1,
            width: 100,
            height: 100,
            borderRadius: Border.radius,
            borderWidth: Border.width,
            borderColor: Border.color
        },
    });
}