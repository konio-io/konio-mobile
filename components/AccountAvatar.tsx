import { View, StyleSheet } from 'react-native';
import { createAvatar } from '@dicebear/core';
import { identicon } from '@dicebear/collection';
import { SvgXml } from 'react-native-svg';
import { useTheme } from '../hooks';
import type { Theme } from '../types/store';

export default (props: {
    address: string,
    size: number
}) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    const avatar = createAvatar(identicon, {
        seed: props.address,
        size: props.size
    });

    /**
     * remove svg mask because it causes a blurry image
     */
    const svgString = avatar.toString().replace('<g mask="url(#viewboxMask)">','<g>');
    
    return (
        <View style={{
            ...styles.container,
            width: props.size,
            height: props.size
        }}>
            <SvgXml xml={svgString} width='100%' height='100%' />
        </View>
    );
}

const createStyles = (theme: Theme) => {
    const { Border } = theme.vars;

    return StyleSheet.create({
        ...theme.styles,
        container: {
            borderWidth: Border.width,
            borderColor: Border.color,
            borderRadius: Border.radius,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 1,
            backgroundColor: 'white'
        }
    });
}