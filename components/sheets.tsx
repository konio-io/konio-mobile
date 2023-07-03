import { registerSheet } from 'react-native-actions-sheet';
import ActionSheetCoin from './ActionSheetCoin';
import ActionSheetAccount from './ActionSheetAccount';
import ActionSheetAddressbookItem from './ActionSheetAddressbookItem';
import ActionSheetOperations from './ActionSheetOperations';
import ActionSheetNetwork from './ActionSheetNetwork';
 
registerSheet("coin", ActionSheetCoin);
registerSheet("account",ActionSheetAccount);
registerSheet("addressbook_item", ActionSheetAddressbookItem);
registerSheet("operations", ActionSheetOperations);
registerSheet('network', ActionSheetNetwork);

export {};