import { useHookstate } from "@hookstate/core";
import { Wrapper, Text, Button } from "../components"
import { useCurrentSeed } from "../hooks"

export default () => {

    const currentLock = useHookstate(true);
    const currentSeed = useCurrentSeed().get();

    return (
        <Wrapper>
            {currentLock.get() === false &&
                <Text>{currentSeed}</Text>
            }

            {currentLock.get() === true &&
                <Button title="show" onPress={() => currentLock.set(false)}/>
            }
        </Wrapper>
    )
}