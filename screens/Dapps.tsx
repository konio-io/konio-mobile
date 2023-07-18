import { View, Image, FlatList, Linking, StyleSheet } from "react-native";
import { DAPPS_URL } from "../lib/Constants";
import { ImmutableArray, ImmutableObject, useHookstate } from "@hookstate/core";
import { Dapp, Theme } from "../types/store";
import { Text, Screen, Link, Accordion } from "../components";
import { useTheme } from "../hooks";
import { useEffect } from "react";
import { rgba } from "../lib/utils";
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler";

export default () => {

    const data = useHookstate<Array<Dapp>>([]);
    const selectedTag = useHookstate('all');

    const load = () => {
        fetch(`${DAPPS_URL}/index.json`)
            .then(response => response.json())
            .then(json => {
                const list: Array<Dapp> = Object.values(json);
                data.set(list);
            });
    }

    const selectTag = (tag: string) => {
        selectedTag.set(tag);
    }

    useEffect(() => {
        load();
    }, []);

    let filteredData = data.get();
    if (selectedTag.get() !== 'all') {
        filteredData = data.get().filter(item => item.tags.includes(selectedTag.get()));
    }

    return (
        <Screen>
            <Tagsbar data={data.get()} selected={selectedTag.get()} onSelect={(tag: string) => selectTag(tag)} />
            <FlatList
                data={filteredData}
                renderItem={({ item }) => <Item key={item.name} item={item} />}
            />
        </Screen>
    )
}

const Tagsbar = (props: {
    data: ImmutableArray<Dapp>
    selected: string,
    onSelect: Function
}) => {
    const theme = useTheme();
    const styles = createStyles(theme);
    const tags: Record<string, number> = { all: props.data.length };


    for (let item of props.data) {
        for (let tag of item.tags) {
            if (!tags[tag]) {
                tags[tag] = 0;
            }

            tags[tag] = tags[tag] + 1;
        }
    }

    return (
        <View style={{ ...styles.paddingBase, ...styles.directionRow, ...styles.columnGapSmall, ...styles.rowGapSmall, flexWrap: 'wrap' }}>
            {
                Object.keys(tags).map(tag =>
                    <Tag key={tag} name={tag} count={tags[tag]} selected={props.selected === tag} onPress={(tag: string) => props.onSelect(tag)} />
                )
            }
        </View>
    )
}

const Tag = (props: {
    name: string,
    count: number,
    selected: boolean,
    onPress: Function
}) => {
    const { name, count, selected } = props;
    const theme = useTheme();
    const styles = createStyles(theme);
    const style = selected ? styles.tagSelected : styles.tag;

    return (
        <TouchableOpacity key={name} onPress={() => props.onPress(name)}>
            <Text style={style}>{name}({count})</Text>
        </TouchableOpacity>
    )
}

const Item = (props: {
    item: ImmutableObject<Dapp>
}) => {

    const theme = useTheme();
    const styles = createStyles(theme);

    return (
        <Accordion
            header={(
                <View style={{ ...styles.directionRow, ...styles.columnGapBase }}>
                    <TouchableWithoutFeedback onPress={() => Linking.openURL(props.item.url)}>
                        <Image style={styles.itemIcon} source={{ uri: props.item.icon }} />
                    </TouchableWithoutFeedback>

                    <View style={styles.itemRightContainer}>
                        <Text style={styles.textMedium}>{props.item.name}</Text>
                        <Text style={styles.textSmall}>{props.item.summary}</Text>
                    </View>
                </View>
            )}
        >
            <View style={{ marginLeft: styles.itemIcon.width + 15 }}>
                <Text style={styles.itemDescription}>{props.item.description}</Text>
                <Link text={props.item.url} onPress={() => Linking.openURL(props.item.url)} />
            </View>
        </Accordion>
    )
}

const createStyles = (theme: Theme) => {
    const { Color, FontSize, FontFamily, Spacing, Border } = theme.vars;
    const styles = theme.styles;

    return StyleSheet.create({
        ...theme.styles,
        itemIcon: {
            width: 50,
            height: 50,
            borderRadius: 50
        },
        itemRightContainer: {
            flexGrow: 1
        },
        itemDescription: {
            ...styles.text,
            flex: 1,
            flexWrap: 'wrap',
            textAlign: 'justify'
        },
        tagSelected: {
            backgroundColor: Color.secondary,
            color: Color.base,
            fontSize: FontSize.small,
            fontFamily: FontFamily.sans,
            padding: Spacing.small,
            borderRadius: Border.radius
        },
        tag: {
            backgroundColor: rgba(Color.secondary, 0.1),
            color: Color.secondary,
            fontSize: FontSize.small,
            fontFamily: FontFamily.sans,
            padding: Spacing.small,
            borderRadius: Border.radius
        }
    });
}