import theblockchainapi from 'theblockchainapi';

let defaultClient = theblockchainapi.ApiClient.instance;

// Get a free API Key Pair here: https://dashboard.theblockchainapi.com/api-keys

let APIKeyID = defaultClient.authentications['APIKeyID'];
APIKeyID.apiKey = '6Daxd5rYz0UYTR2';

let APISecretKey = defaultClient.authentications['APISecretKey'];
APISecretKey.apiKey = 'Q9RwXmuU3zy5EOO';

let apiInstance = new theblockchainapi.SolanaWalletApi();
let network = 'mainnet-beta'; // String | The network ID (devnet, mainnet-beta)
let publicKey = '8WRsGBaDcs1X7bHWr4Ad5Nx3bW29BkcmEbyavrLXDC4i'; // String | The public key of the account whose list of owned NFTs you want to get

const result = await apiInstance.solanaGetNFTsBelongingToWallet(network, publicKey).then((data) => {
  console.log('API called successfully.');
  return data;
}, (error) => {
  console.error(error);
  return error;
});

console.log("NFTs: ", result);

