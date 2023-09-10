import { View } from 'react-native';
import ActivityIndicator from './ActivityIndicator';
import { useSpinner, useTheme } from '../hooks';

export default () => {
    const theme = useTheme();
    const styles = theme.styles;
    const { Border } = theme.vars;
    const spinner = useSpinner();

    if (spinner.get() === true) {
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
                    backgroundColor: 'white', 
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