import { View } from 'react-native';
import { useTheme } from '../hooks';

export default () => {
  const theme = useTheme();
  const styles = theme.styles;

  return (
    <View style={styles.separator} />
  );
}