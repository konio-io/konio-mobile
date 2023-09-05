# Konio Mobile Wallet

The first Koinos blockchain native mobile wallet.

## Build
### Local build
```
npm install
npx expo prebuild -p android
npx expo start --dev-client --clear
```
### Internal preview
```
eas build -p android --profile localPreview --local
```

# expo49 update
https://github.com/facebook/metro/issues/1064
https://github.com/margelo/react-native-quick-crypto/issues/186