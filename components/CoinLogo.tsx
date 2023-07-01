import { useCoin } from '../hooks';
import CircleLogo from './CircleLogo';

export default (props: {
    contractId: string
    size: number
}) => {
    const coin = useCoin(props.contractId).get();

    return (
        <CircleLogo 
            seed={coin.contractId} 
            name={coin.symbol} 
            size={props.size}
        />
    );
}