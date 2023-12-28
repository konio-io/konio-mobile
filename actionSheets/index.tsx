import { registerSheet } from 'react-native-actions-sheet';
import ActionSheetCoin from './ActionSheetCoin';
import ActionSheetAccount from './ActionSheetAccount';
import ActionSheetContact from './ActionSheetContact';
import ActionSheetOperations from './ActionSheetOperations';
import ActionSheetNetwork from './ActionSheetNetwork';
import ActionSheetNft from './ActionSheetNft';
import ActionSheetWcProposal from './ActionSheetWcProposal';
import ActionSheetWcRequest from './ActionSheetWcRequest';
import ActionSheetRecipient from './ActionSheetRecipient';
import ActionSheetAssetCoin from './ActionSheetAssetCoin';
import ActionSheetAssetNft from './ActionSheetAssetNft';
import ActionSheetDapp from './ActionSheetDapp';
import ActionSheetFee from './ActionSheetFee';
 
registerSheet("coin", ActionSheetCoin);
registerSheet("account",ActionSheetAccount);
registerSheet("addressbook_item", ActionSheetContact);
registerSheet("operations", ActionSheetOperations);
registerSheet('network', ActionSheetNetwork);
registerSheet("nft", ActionSheetNft);
registerSheet("wc_proposal", ActionSheetWcProposal);
registerSheet("wc_request", ActionSheetWcRequest);
registerSheet("recipient", ActionSheetRecipient);
registerSheet("asset_coin", ActionSheetAssetCoin);
registerSheet("asset_nft", ActionSheetAssetNft);
registerSheet("dapp", ActionSheetDapp);
registerSheet("fee", ActionSheetFee)

export {};