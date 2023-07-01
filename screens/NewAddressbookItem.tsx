import { useHookstate } from '@hookstate/core';
import { useNavigation } from '@react-navigation/native';
import type { NewCoinNavigationProp } from '../types/navigation';
import { addAddressBookItem, showToast } from '../actions';
import { Feather } from '@expo/vector-icons';
import { TextInput, Button, Screen, Wrapper } from '../components';
import { useI18n } from '../hooks';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../hooks';
import { utils } from 'koilib';
import type { Theme } from '../types/store';

export default () => {
    const navigation = useNavigation<NewCoinNavigationProp>();
    const address = useHookstate('');
    const name = useHookstate('');
    const i18n = useI18n();
    const theme = useTheme();
    const styles = createStyles(theme);

    const add = () => {
        if (!address.get()) {
            showToast({
                type: 'error',
                text1: i18n.t('missing_address')
            });
            return;
        }

        if (!name.get()) {
            showToast({
                type: 'error',
                text1: i18n.t('missing_name')
            });
            return;
        }

        try {
            const check = utils.isChecksumAddress(address.get());
            if (!check) {
                throw "Invalid address";
            }
        } catch (e) {
            showToast({
                type: 'error',
                text1: i18n.t('invalid_address')
            });
            return;
        }
        
        addAddressBookItem({
            address: address.get(),
            name: name.get()
        });
   
        showToast({
            type: 'success',
            text1: i18n.t('created', { name: name.get() }),
        });
        navigation.goBack();
    };

    return (
        <Screen>
            <Wrapper type="full">
                <View style={styles.container}>
                    <TextInput
                        autoFocus={true}
                        value={name.get()}
                        onChangeText={(v: string) => name.set(v.trim())}
                        placeholder={i18n.t('name')}
                    />
                    <TextInput
                        value={address.get()}
                        onChangeText={(v: string) => address.set(v.trim())}
                        placeholder={i18n.t('address')}
                    />
                </View>
            </Wrapper>

            <View style={styles.screenFooter}>
                <Button
                    title="Add coin"
                    onPress={() => add()}
                    icon={<Feather name="plus" />}
                />
            </View>
        </Screen>
    );
}

const createStyles = (theme: Theme) => {
    const { Spacing } = theme.vars;

    return StyleSheet.create({
        ...theme.styles,
        container: {
            rowGap: Spacing.small
        }
    });
}