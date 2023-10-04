import { Button, Logo, Text, Wrapper } from "../components"
import { useI18n, useTheme } from "../hooks"
import { View } from "react-native";
import { SpinnerStore } from "../stores";
import { useState } from "react";
import { executeMigration } from "../stores/migrations";

export default () => {
    const [result, setResult] = useState(-1);
    const theme = useTheme();
    const styles = theme.styles;
    const i18n = useI18n();
    const [errors, setErrors] = useState('');

    const _execute = async () => {
        try {
            SpinnerStore.actions.showSpinner();
            await executeMigration();
            setResult(1);
            SpinnerStore.actions.hideSpinner();
        } catch (e) {
            setErrors(e instanceof Error ? e.message : String(e));
            setResult(0);
            SpinnerStore.actions.hideSpinner();
        }
    }

    return (
        <Wrapper>
            <View style={styles.alignCenterColumn}>
                <Logo width={130} height={130} />
            </View>

            {result === -1 &&
                <View style={{ ...styles.rowGapBase }}>
                    <View style={styles.alignCenterColumn}>
                        <Text style={{ ...styles.text, ...styles.textCenter, width: 200 }}>
                            {i18n.t('migrate_data_need')}
                        </Text>
                    </View>
                    <Button title={i18n.t('migrate_data')} onPress={() => _execute()} />
                </View>
            }
            {
                result === 0 &&
                <View style={styles.alignCenterColumn}>
                    <Text style={{ ...styles.textError, ...styles.textCenter }}>
                        {i18n.t('migration_error')}
                    </Text>
                    <Text style={{ ...styles.text, ...styles.textCenter }}>
                        {i18n.t('migration_error_desc')}
                    </Text>
                    <Text>
                        {errors}
                    </Text>
                </View>
            }
            {
                result === 1 &&
                <View style={styles.alignCenterColumn}>
                    <Text style={{ ...styles.text, ...styles.textCenter}}>{i18n.t('migration_success')}</Text>
                </View>
            }
        </Wrapper>
    );
}