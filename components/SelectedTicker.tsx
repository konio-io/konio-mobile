import { View } from 'react-native';
import { useTheme } from '../hooks';
import { Feather } from '@expo/vector-icons';

export default (props: {
    selected: boolean
}) => {

    const { Color } = useTheme().vars;
    
    return (
        <View>
            {
                props.selected === true && <Feather name="check-circle" size={20} color={Color.primary} />
            }
            {
                props.selected === false && <Feather name="circle" size={20} color={Color.primary} />
            }
        </View>
    )
}