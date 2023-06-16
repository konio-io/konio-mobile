import { ActivityIndicator } from 'react-native';
import { useTheme } from '../hooks';

export default (props: any) => {
    const theme = useTheme().get();
    const { Color } = theme.vars;

    const defaultProps = {
        color: Color.primary
    };

    const wprops = {...defaultProps, ...props};

    return <ActivityIndicator {...wprops}/>;
}