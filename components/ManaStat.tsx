import { StyleSheet, View } from 'react-native';
import { useTheme } from '../hooks';
import CircularProgress from './CircularProgress';
import Text from './Text';
import type { Theme } from '../types/store';

export default (props: {
    percent: number,
    balance: number,
    timeRecharge: number
}) => {
    const size = 150;
    const theme = useTheme().get();
    const { Color } = theme.vars;
    const styles = createStyles(theme);

    let color = Color.success;
    if (props.percent < 20) {
        color = Color.error;
    } else if (props.percent < 50) {
        color = Color.warning;
    }

    return (
        <View style={styles.wrapper}>
            <CircularProgress
                size={size}
                strokeWidth={5}
                progressPercent={props.percent}
                text={props.percent.toString() + '%'}
                textSize={size * 17 / 100}
                pgColor={color}
                textColor={color}
            />

            <View>
                <Text style={styles.title}>Balance</Text>
                <Text style={{ ...styles.textCenter, ...styles.text }}>{props.balance.toString()}</Text>
            </View>

            <View>
                <Text style={styles.title}>Time recharge</Text>
                <Text style={{ ...styles.textCenter, ...styles.text }}>{millisecondsToString(props.timeRecharge)}</Text>
            </View>
        </View>
    );
}

const millisecondsToString = (milliseconds: number) => {
    if (Number.isNaN(milliseconds)) return "";

    var seconds = Math.floor(milliseconds / 1000);

    var interval = seconds / 86400;
    if (interval > 2) return Math.floor(interval) + " days";

    interval = seconds / 3600;
    if (interval > 2) return Math.floor(interval) + " hours";

    interval = seconds / 60;
    if (interval > 2) return Math.floor(interval) + " minutes";

    interval = Math.floor(seconds);
    if (interval === 0) return "Mana recharged";
    return interval + " seconds";
}


const createStyles = (theme: Theme) => {
    const { Spacing, FontFamily, Color } = theme.vars;
    return StyleSheet.create({
        ...theme.styles,
        wrapper: {
            alignItems: 'center',
            justifyContent: 'center',
            rowGap: Spacing.base,
            padding: Spacing.base
        },
        modalContent: {
            alignItems: 'center',
            justifyContent: 'center',
            rowGap: Spacing.base,
            padding: Spacing.base
        },
        title: {
            fontFamily: FontFamily.sans,
            fontWeight: 'bold',
            color: Color.baseContrast,
            textAlign: 'center'
        },
        text: {
            fontFamily: FontFamily.sans,
            color: Color.baseContrast,
            textAlign: 'center'
        }
    });
}