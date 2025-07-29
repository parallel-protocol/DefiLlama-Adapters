const {sumTokens2 } = require("../helper/unwrapLPs.js")
const {
    config,
  } = require("./config.js");

async function tvl(api) {
    const {vaultCore} = config[api.chain]
    const ownerTokens = []
    for (const vault of vaultCore) {
        const addressProvider = await api.call({  abi: 'address:a', target: vault})
        const config = await api.call({  abi: 'address:config', target: addressProvider})
        const tokenConfig = await api.fetchList({  lengthAbi: 'numCollateralConfigs', itemAbi: "function collateralConfigs(uint256 _id) view returns ((address collateralType, uint256 debtLimit, uint256 liquidationRatio, uint256 minCollateralRatio, uint256 borrowRate, uint256 originationFee, uint256 liquidationBonus, uint256 liquidationFee))", target: config})
        const tokens = tokenConfig.map(t => t.collateralType)
        ownerTokens.push([tokens, vault])
    }
    return sumTokens2({ api, ownerTokens })
}

Object.keys(config).forEach(chain => {
    module.exports[chain] = { tvl }
});
