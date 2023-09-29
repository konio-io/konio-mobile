import { View } from 'react-native';
import { useTheme } from '../hooks';
import { Octicons } from '@expo/vector-icons';

export default (props: {
    selected: boolean
}) => {

    const { Color } = useTheme().vars;
    
    return (
        <View>
            {
                props.selected === true && 
                <Octicons name="check-circle" size={20} color={Color.primary} />
            }
            {
                props.selected === false && 
                <Octicons name="circle" size={20} color={Color.primary} />
            }
        </View>
    )
}