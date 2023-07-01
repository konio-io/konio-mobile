import { View, StyleSheet, TouchableHighlight } from 'react-native';
import { useTheme } from '../hooks';
import type { Theme } from '../types/store';
import { ReactElement } from 'react';
import Text from './Text';

export default (props: {
    phrase: string,
    onWordClick?: Function
}) => {
    const theme = useTheme();
    const styles = createStyles(theme);
    const childrenList: Array<ReactElement> = [];
    const words = props.phrase.split(' ');

    let counter = 0;
    if (words.length > 0 && words[0] !== '') {
        for (const word of words) {
            counter++;
            childrenList.push(
                <WordTag key={counter} word={word} onClick={() => {
                    if (props.onWordClick) {
                        props.onWordClick(word);
                    }
                }} />
            );
        }
    }

    return (
        <View style={styles.wordsContainer}>
            {childrenList.length > 0 && childrenList}
        </View>
    );
}


const WordTag = (props: {
    word: string
    onClick: Function
}) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    return (
        <TouchableHighlight onPress={() => props.onClick(props.word)}>
            <View style={styles.wordTagContainer}>
                <View style={styles.wordContainer}>
                    <Text>{props.word}</Text>
                </View>
            </View>
        </TouchableHighlight>
    );
}

const createStyles = (theme: Theme) => {
    const { Spacing, Border } = theme.vars;

    return StyleSheet.create({
        ...theme.styles,
        wordsContainer: {
            flexDirection: 'row',
            columnGap: Spacing.small,
            rowGap: Spacing.small,
            flexWrap: 'wrap',
            height: 180
        },
        wordTagContainer: {
            flexDirection: 'row'
        },
        wordContainer: {
            backgroundColor: Border.color,
            borderRadius: Border.radius,
            height: 30,
            justifyContent: 'center',
            paddingHorizontal: Spacing.small
        }
    });
}