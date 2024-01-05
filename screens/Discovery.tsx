import { useEffect, useState } from "react";
import { Screen, Text } from "../components";
import { View, FlatList, TouchableOpacity, Image, Linking } from "react-native";
import * as rssParser from 'react-native-rss-parser';
import { useTheme } from "../hooks";
import { DISCOVERY_RSS } from "../lib/Constants";
import { SpinnerStore } from "../stores";

export default () => {

    const [feedData, setFeedData] = useState([]);

    useEffect(() => {
        const fetchRssFeed = async () => {
            try {
                SpinnerStore.actions.showSpinner();
                const response = await fetch(DISCOVERY_RSS);
                const text = await response.text();
                const parsedData = await rssParser.parse(text);
                setFeedData(parsedData.items.slice(0, 10));
                SpinnerStore.actions.hideSpinner();
            } catch (error) {
                console.error(error);
                SpinnerStore.actions.hideSpinner();
            }
        };

        fetchRssFeed();
    }, []);

    return (
        <Screen>
            <View>
                <FlatList
                    data={feedData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <Article item={item} />}
                />
            </View>
        </Screen>
    );
}

const Article = (props: {
    item: any
}) => {
    const theme = useTheme();
    const styles = theme.styles;

    return (
        <TouchableOpacity onPress={() => Linking.openURL(props.item.id)}>
            <View style={{ ...styles.paddingBase, ...styles.directionRow, ...styles.columnGapBase }}>
                <Thumbnail item={props.item} />
                <View style={{flex: 1}}>
                    <Date item={props.item} />
                    <Text style={{...styles.textMedium}}>{props.item.title}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const Thumbnail = (props: {
    item: any
}) => {
    const theme = useTheme();
    const vars = theme.vars;

    let imgSrc = '';

    const content = props.item.content;
    const imgStart = content.indexOf("<img");
    if (imgStart !== -1) {
        const imgEnd = content.indexOf(">", imgStart);
        const imgTag = content.substring(imgStart, imgEnd + 1);
        const srcMatch = imgTag.match(/src\s*=\s*"([^"]+)"/i);
        const src = srcMatch ? srcMatch[1] : null;
        imgSrc = src;
    }

    return (<Image source={{ uri: imgSrc }} style={{ width: 80, height: 80, borderRadius: vars.Border.radius }} />)
}

const Date = (props: {
    item: any
}) => {
    const theme = useTheme();
    const styles = theme.styles;

    return (<Text style={styles.textSmall}>{props.item.published}</Text>)
}