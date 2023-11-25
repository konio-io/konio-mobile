import { View } from "react-native";
import { BROWSER_HOME_URL, BROWSER_SEARCH_URL } from "../lib/Constants";
import { Screen, DrawerToggler, ButtonCircle, TextInput } from "../components";
import { useTheme } from "../hooks";
import { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { BrowserNavigationProp, RootNavigationProp } from "../types/navigation";
import { AntDesign, Feather } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native";
import WebView, { WebViewNavigation } from "react-native-webview";

export default () => {
    const navigation = useNavigation<BrowserNavigationProp>();
    const theme = useTheme();
    const styles = theme.styles;
    const [uri, setUri] = useState(BROWSER_HOME_URL);
    const [searchUri, setSearchUri] = useState('');
    //const [canGoBack, setCanGoBack] = useState(false);
    //const [canGoForward, setCanGoForward] = useState(false);

    const webViewRef = useRef<WebView>(null);
    const onWebviewChange = (ev: WebViewNavigation) => {
        //setCanGoBack(ev.canGoBack);
        //setCanGoForward(ev.canGoForward);
        if (ev.url !== searchUri) {
            setSearchUri(ev.url);
        }
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

    useEffect(() => {
        setSearchUri(uri);
    }, [uri])

    return (
        <Screen>

            <View>
                <TextInput 
                    value={searchUri} 
                    onChangeText={(v:string) => setSearchUri(v)} 
                    keyboardType="url" 
                    onSubmitEditing={() => {
                        const searchUriLower = searchUri.toLowerCase();
                        if (searchUriLower.startsWith('http')) {
                            setUri(searchUriLower);
                        } else {
                            setUri(BROWSER_SEARCH_URL + searchUriLower);
                        }
                    }}/>
            </View>

            <View style={{
                flex: 1,
                borderWidth: theme.vars.Border.width,
                borderColor: theme.vars.Border.color
            }}>
                <WebView
                    onNavigationStateChange={onWebviewChange}
                    ref={webViewRef}
                    source={{ uri }}
                />
            </View>

            <View style={{
                ...styles.directionRow,
                ...styles.columnGapBase,
                ...styles.alignCenterRow,
                paddingHorizontal: theme.vars.Spacing.base,
                paddingVertical: theme.vars.Spacing.small
            }}>
                <View style={{ ...styles.directionRow, ...styles.columnGapSmall }}>
                    <ButtonCircle
                        size={40}
                        onPress={() => webViewRef.current?.goBack() }
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
                    onPress={() => setUri(BROWSER_HOME_URL + `?t=` + Date.now())}
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

        </Screen>
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