import { Modal, TouchableHighlight, StyleSheet, View } from 'react-native';
import { useHookstate, State } from '@hookstate/core';
import { useTheme } from '../hooks';
import Text from './Text';
import type { Theme } from '../types/store';
import { Feather } from '@expo/vector-icons';
import { ReactNode } from 'react'

export default (props: {
    openState: State<boolean>,
    title: string,
    children: ReactNode
}) => {

    const openState = useHookstate(props.openState);
    const theme = useTheme().get();
    const styles = createStyles(theme);
    const { Color } = theme.vars;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={openState.get()}
            onRequestClose={() => {
                openState.set(!openState.get());
            }}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>

                        <View style={{ zIndex: 1 }}>
                            <TouchableHighlight onPress={() => openState.set(false)}>
                                <View style={styles.modalXicon}>
                                    <Feather name="x" size={18} color={Color.primary} />
                                </View>
                            </TouchableHighlight>
                        </View>

                        <Text style={styles.modalTitle}>{props.title}</Text>
                    </View>
                    <View>
                        {props.children}
                    </View>
                </View>
            </View>
        </Modal >
    );
}


const createStyles = (theme: Theme) => {
    const { Spacing, Color, Border, FontFamily, FontSize } = theme.vars;
    return StyleSheet.create({
        ...theme.styles,
        modalHeader: {
            height: 50,
            borderBottomColor: Border.color,
            borderBottomWidth: Border.width,
            justifyContent: 'center'
        },
        modalXicon: {
            position: 'absolute',
            right: Spacing.base
        },
        modalTitle: {
            color: Color.baseContrast,
            textAlign: 'center',
            fontFamily: FontFamily.sans,
            fontSize: FontSize.medium
        },
        modalContainer: {
            margin: 15,
            backgroundColor: Color.base,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            minWidth: 300
        },
        modalOverlay: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(50,50,50,0.5)',
        }
    });
}