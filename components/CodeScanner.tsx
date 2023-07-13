import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Button from './Button';
import Text from './Text';
import { useI18n, useTheme } from '../hooks';
import { useHookstate } from '@hookstate/core';
import Loading from '../screens/Loading';
import { AntDesign } from '@expo/vector-icons';

export default (props: {
    onScan: Function
}) => {
    const hasPermission = useHookstate<boolean | null>(null);
    const scanned = useHookstate(false);
    const theme = useTheme();
    const styles = theme.styles;
    const i18n = useI18n();

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            hasPermission.set(status === 'granted');
        };

        getBarCodeScannerPermissions();
    }, []);

    const handleBarCodeScanned = ({ data }) => {
        scanned.set(true);
        props.onScan(data);
    };

    if (hasPermission.get() === null) {
        return (
            <Loading/>
        )
    }

    if (hasPermission.get() === false) {
        return (
            <View style={{...styles.flex1, ...styles.alignCenterColumn, ...styles.alignCenterRow}}>
                <Text>{i18n.t('no_access_camera')}</Text>
            </View>
        );
    }

    return (
        <View style={styles.flex1}>
            <BarCodeScanner
                barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                onBarCodeScanned={scanned.get() ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />

            {scanned.get() &&
                <View style={styles.paddingBase}>
                    <Button 
                        icon={(<AntDesign name="scan1" size={24} color="black" />)}
                        title={i18n.t('scan_again')} 
                        onPress={() => scanned.set(false)} 
                    />
                </View>
            }
        </View>
    );
}