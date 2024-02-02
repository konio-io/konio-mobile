import { Text, Accordion } from "../components"
import { useI18n, useTheme } from "../hooks";
import { View } from "react-native";
import { useEffect, useState } from "react";
import { LogStore, KoinStore } from "../stores";
import { TransactionJson } from "koilib/lib/interface";

export default (props: {
    transaction: TransactionJson
}) => {
    const i18n = useI18n();
    const theme = useTheme();
    const styles = theme.styles;
    const [items, setItems] = useState<Array<any>>([]);

    const _loadDetails = async () => {
        const operations = props.transaction.operations;
        let events: any = [];

        try {
            const res = await KoinStore.actions.signAndSendTransaction(props.transaction, {
                broadcast: false
            });
            if (res.receipt.events) {
                events = res.receipt.events;
            }
        } catch (e) {
            //console.error(e);
            //LogStore.actions.logError(String(e));
        }

        if (events.length > 0) {
            _loadEvents(events);
        } else {
            _loadOperations(operations);
        }
    }

    const _loadEvents = async (events: any) => {
        for (const event of events) {
            const contractId = event.source;

            try {
                const contract = await KoinStore.getters.fetchContract(contractId);

                if (contract.abi) {
                    const decodedEvent = await contract.decodeEvent(event);
                    const { args } = decodedEvent;
                    setItems(current => [
                        ...current,
                        {
                            name: event.name,
                            args: JSON.stringify(args)
                        }
                    ]);
                }
            } catch (e) {
                //console.error(e);
                //LogStore.actions.logError(String(e));
                setItems(current => [
                    ...current,
                    {
                        name: event.name,
                        args: "unable to decode event"
                    }
                ]);
            }
        }
    }

    const _loadOperations = async (operations: any) => {
        for (const operation of operations) {
            const contractId = operation.call_contract.contract_id;

            try {
                const contract = await KoinStore.getters.fetchContract(contractId);

                if (contract.abi) {
                    const decodedOperation = await contract.decodeOperation(operation)
                    const { name, args } = decodedOperation;
                    setItems(current => [
                        ...current,
                        {
                            name,
                            //description: contract.abi?.methods[name].description,
                            args: JSON.stringify(args)
                        }
                    ]);
                }
            } catch (e) {
                console.error(e);
                LogStore.actions.logError(String(e));
            }
        }
    }

    useEffect(() => {
        _loadDetails();
    }, [props.transaction])


    return (
        <View>
            <Accordion
                header={(
                    <View style={{ ...styles.paddingVerticalBase }}>
                        <Text style={styles.textSmall}>{i18n.t('events')}</Text>
                    </View>
                )}
            >
                <View>
                    {
                        items.map((item, index) =>
                            <View key={index} style={{ ...styles.paddingVerticalSmall }}>
                                <View>
                                    <Text>{item.name}</Text>
                                </View>
                                {
                                    Object.keys(item).filter(k => k !== 'name').map(k =>
                                        <View key={k}>
                                            <Text style={styles.textSmall}>{item[k]}</Text>
                                        </View>
                                    )
                                }
                            </View>
                        )
                    }
                </View>

            </Accordion>

        </View>
    )
}