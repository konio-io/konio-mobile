import { View, FlatList, StyleSheet } from "react-native";
import { DAPPS_URL } from "../lib/Constants";
import { Dapp, Theme } from "../types/ui";
import { Text, Screen, DrawerToggler, DappLogo, ButtonCircle } from "../components";
import { useTheme } from "../hooks";
import { useEffect, useRef, useState } from "react";
import { rgba } from "../lib/utils";
import { useNavigation } from "@react-navigation/native";
import { DappsNavigationProp, RootNavigationProp } from "../types/navigation";
import { AntDesign, Feather } from '@expo/vector-icons';
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { LogStore, SpinnerStore } from "../stores";
import WebView, { WebViewNavigation } from "react-native-webview";

export default () => {
    const navigation = useNavigation<DappsNavigationProp>();
    const theme = useTheme();
    const styles = theme.styles;
    const [uri, setUri] = useState('');
    const [canGoBack, setCanGoBack] = useState(false);

    const webViewRef = useRef<WebView>(null);
    const onWebviewChange = (ev: WebViewNavigation) => {
        setCanGoBack(ev.canGoBack);
    }

    useEffect(() => {
        navigation.setOptions({
            headerShadowVisible: false,
            headerTitleAlign: 'center',
            headerLeft: () => (<DrawerToggler />),
            headerRight: () => (
                <View style={{ paddingRight: theme.vars.Spacing.small }}>
                    <ScanButton />
                </View>
            ),
        });
    }, [navigation, theme]);

    return (
        <Screen>
            <View style={{
                ...styles.directionRow,
                ...styles.columnGapBase,
                ...styles.alignCenterRow,
                paddingHorizontal: theme.vars.Spacing.base,
                paddingVertical: theme.vars.Spacing.small
            }}>
                <View style={{...styles.directionRow, ...styles.columnGapSmall}}>
                    <ButtonCircle
                        size={40}
                        onPress={() => canGoBack ? webViewRef.current?.goBack() : setUri('')}
                        icon={(<Feather name="arrow-left" />)}
                        iconSize={20}
                        type='secondary'
                    />
                    <ButtonCircle
                        size={40}
                        onPress={() => webViewRef.current?.goForward()}
                        icon={(<Feather name="arrow-right" />)}
                        iconSize={20}
                        type='secondary'
                    />
                </View>

                <ButtonCircle
                    size={40}
                    onPress={() => setUri('')}
                    icon={(<Feather name="home" />)}
                    iconSize={20}
                    type='secondary'
                />
                <ButtonCircle
                    size={40}
                    onPress={() => webViewRef.current?.reload()}
                    icon={(<Feather name="refresh-cw" />)}
                    iconSize={20}
                    type='secondary'
                />

            </View>
            <View style={{
                flex: 1
            }}>
                {
                    uri !== '' &&
                    <WebView
                        onNavigationStateChange={onWebviewChange}
                        ref={webViewRef}
                        source={{ uri }}
                    />
                }
                {
                    uri === '' &&
                    <Dapps onItemClick={(item: Dapp) => setUri(item.url)} />
                }
            </View>
        </Screen>
    )
}


const Dapps = (props: {
    onItemClick: Function
}) => {
    const [data, setData] = useState<Array<Dapp>>([]);
    const [selectedTag, setSelectedTag] = useState('all');
    const { vars } = useTheme();

    const load = () => {
        SpinnerStore.actions.showSpinner();
        fetch(`${DAPPS_URL}/index.json`)
            .then(response => response.json())
            .then(json => {
                const list: Array<Dapp> = Object.values(json);
                const sortedList = list
                    .sort((a: Dapp, b: Dapp) => {
                        if (a.name && !b.name) {
                            return -1;
                        }
                        if (!a.name && b.name) {
                            return 1;
                        }

                        return a.name.localeCompare(b.name);
                    });
                setData(sortedList);
                SpinnerStore.actions.hideSpinner();
            })
            .catch(e => {
                LogStore.actions.logError(e);
                SpinnerStore.actions.hideSpinner();
            });
    }

    useEffect(() => {
        load();
    }, []);


    let filteredData = data;
    if (selectedTag !== 'all') {
        filteredData = filteredData
            .filter(item => item.tags.includes(selectedTag));
    }

    return (
        <View style={{paddingBottom: vars.Spacing.base, flex: 1}}>
            {
                filteredData.length > 0 &&
                <>
                    <View style={{ marginBottom: vars.Spacing.base }}>
                        <Tagsbar data={data} selected={selectedTag} onSelect={(tag: string) => setSelectedTag(tag)} />
                    </View>

                    <FlatList
                        data={filteredData}
                        renderItem={({ item }) => <Item key={item.name} item={item} onClick={() => props.onItemClick(item)} />}
                        ItemSeparatorComponent={() => <View style={{ height: vars.Spacing.medium }} />}
                    />
                </>
            }
        </View>
    )
}

const ScanButton = () => {
    const theme = useTheme();
    const { Spacing, Color } = theme.vars;
    const navigation = useNavigation<RootNavigationProp>();

    const openScan = () => {
        navigation.navigate('Root', {
            screen: 'WalletConnect',
            params: {
                screen: 'WcPairScan'
            }
        })
    }

    return (
        <TouchableOpacity onPress={() => openScan()}>
            <View style={{ marginRight: Spacing.base }}>
                <AntDesign name='scan1' size={28} color={Color.baseContrast} />
            </View>
        </TouchableOpacity>
    );
}

const Tagsbar = (props: {
    data: Array<Dapp>
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
                Object.keys(tags).sort().map(tag =>
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
    item: Dapp,
    onClick: Function
}) => {

    const theme = useTheme();
    const styles = createStyles(theme);

    return (
        <TouchableWithoutFeedback onPress={() => props.onClick(props.item)}>

            <View style={{ ...styles.directionRow, ...styles.columnGapBase, ...styles.paddingHorizontalBase }}>

                <DappLogo dapp={props.item} />

                <View>
                    <Text style={{ ...styles.textMedium }}>{props.item.name}</Text>
                    <Text style={styles.textSmall}>{props.item.summary}</Text>
                </View>
            </View>

        </TouchableWithoutFeedback>
    )
}

const createStyles = (theme: Theme) => {
    const { Color, FontSize, FontFamily, Spacing, Border } = theme.vars;

    return StyleSheet.create({
        ...theme.styles,
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