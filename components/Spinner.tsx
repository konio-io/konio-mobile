import { View } from 'react-native';
import ActivityIndicator from './ActivityIndicator';
import { useTheme } from '../hooks';
import { SpinnerStore } from '../stores';
import { useHookstate } from '@hookstate/core';

export default () => {
    const theme = useTheme();
    const styles = theme.styles;
    const { Border, Color } = theme.vars;
    const spinner = useHookstate(SpinnerStore.state).get();

    if (spinner === true) {
        return (
            <View style={{
                position: 'absolute', 
                width: '100%', 
                height: '100%', 
                backgroundColor: 'rgba(0,0,0,0.3)', 
                zIndex: 1, 
                ...styles.alignCenterColumn, 
                ...styles.alignCenterRow 
            }}>
                <View style={{
                    borderRadius: Border.radius,
                    width: 100, 
                    height: 100, 
                    backgroundColor: Color.base, 
                    ...styles.alignCenterColumn, 
                    ...styles.alignCenterRow
                }}>
                    <ActivityIndicator size={40}></ActivityIndicator>
                </View>
            </View>
        )
    }

    return <></>;
}