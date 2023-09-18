import React, { ReactElement, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Button from './Button';
import Text from './Text';
import { useI18n, useTheme } from '../hooks';
import Loading from '../screens/Loading';
import { AntDesign, Feather } from '@expo/vector-icons';

export default (props: {
    body: ReactElement
    onScan: Function,
    onClose: Function
}) => {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const theme = useTheme();
    const styles = theme.styles;
    const i18n = useI18n();

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        getBarCodeScannerPermissions();
    }, []);

    const handleBarCodeScanned = (result: any) => {
        setScanned(true);
        props.onScan(result.data);
    };

    if (hasPermission === null) {
        return (
            <Loading />
        )
    }

    if (hasPermission === false) {
        return (
            <View style={{ ...styles.flex1, ...styles.alignCenterColumn, ...styles.alignCenterRow }}>
                <Text>{i18n.t('no_access_camera')}</Text>
            </View>
        );
    }

    return (
        <View style={StyleSheet.absoluteFillObject}>

            <BarCodeScanner
                barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />

            <View style={{ backgroundColor: 'white', position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%' }}>
                <View>
                    {props.body}
                    
                    <View style={{ ...styles.paddingBase, ...styles.directionRow, ...styles.columnGapBase }}>
                        <Button
                            style={styles.flex1}
                            type="secondary"
                            icon={(<Feather name="x" />)}
                            title={i18n.t('cancel')}
                            onPress={() => props.onClose()}
                        />
                        <Button
                            style={styles.flex1}
                            icon={(<AntDesign name="scan1" />)}
                            title={i18n.t('scan_again')}
                            onPress={() => setScanned(false)}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}