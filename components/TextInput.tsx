import { TextInput } from 'react-native';
import { useTheme } from '../hooks';
import { rgba } from '../lib/utils';

export default (props: any) => {

    const theme = useTheme();
    const { Color } = theme.vars;
    const styles = theme.styles;

    const defaultProps = {
        style: styles.textInput,
        placeholderTextColor: rgba(Color.baseContrast, 0.3)
    };

    const wprops = {...defaultProps, ...props};

    return <TextInput {...wprops}/>
}