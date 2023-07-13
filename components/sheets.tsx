import { registerSheet } from 'react-native-actions-sheet';
import ActionSheetCoin from './ActionSheetCoin';
import ActionSheetAccount from './ActionSheetAccount';
import ActionSheetContact from './ActionSheetContact';
import ActionSheetOperations from './ActionSheetOperations';
import ActionSheetNetwork from './ActionSheetNetwork';
import ActionSheetWcPair from './ActionSheetWcPair';
 
registerSheet("coin", ActionSheetCoin);
registerSheet("account",ActionSheetAccount);
registerSheet("addressbook_item", ActionSheetContact);
registerSheet("operations", ActionSheetOperations);
registerSheet('network', ActionSheetNetwork);
registerSheet('wc_pair', ActionSheetWcPair);

export {};