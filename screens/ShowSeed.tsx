import { Wrapper, Text, Button } from "../components"
import { useCurrentSeed, useLocker } from "../hooks"
import Unlock from "./Unlock";
import React from "react";

export default () => {
    const locker = useLocker(1);
    const currentSeed = useCurrentSeed().get();

    if (locker.isRunning()) {
        return <Unlock state={locker.get()}/>
    }

    return (
        <Wrapper>
            {!locker.isLocked() &&
                <Text>{currentSeed}</Text>
            }

            {locker.isLocked() &&
                <Button title="show" onPress={() => locker.run()}/>
            }
        </Wrapper>
    );
}