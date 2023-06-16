import { Text } from 'react-native';
import { useTheme } from '../hooks';

export default (props: any) => {
    const theme = useTheme().get();
    const styles = theme.styles;

    const defaultProps = {
        style: styles.text
    };

    const wprops = {...defaultProps, ...props};

    return (<Text {...wprops}>{props.children}</Text>);
}