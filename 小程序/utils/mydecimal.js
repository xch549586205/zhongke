const Decimal = require('decimal.js');

//加法
export function add(list) {
  if (!list.length) {
    return 0
  }
  let result = new Decimal(list[0]);
  for (let i = 1; i < list.length; i++) {
    result = result.add(new Decimal(list[i]));
  }
  return result.toNumber();
}
//减法
export function sub(...args) {
  let result = new Decimal(args[0]);
  for (let i = 1; i < args.length; i++) {
    result = result.sub(new Decimal(args[i]));
  }
  return result.toNumber();
}
//乘法
export function mul(...args) {
  let result = new Decimal(args[0]);
  for (let i = 1; i < args.length; i++) {
    result = result.mul(new Decimal(args[i]));
  }
  return result.toNumber();
}
//除法
export function div(...args) {
  let result = new Decimal(args[0]);
  for (let i = 1; i < args.length; i++) {
    result = result.div(new Decimal(args[i]));
  }
  return result.toNumber();
}



export function getTotalAmount(orderSku) {
  const userInfo = wx.getStorageSync("userInfo")
  const {
    authorityId
  } = userInfo
  if (!orderSku || !orderSku.length) {
    return 0
  }
  const priceList = orderSku.map(sku => {
    const {
      skuId,
      skuNum
    } = sku
    const {
      skuPrice
    } = sku.sku
    const currentSkuPrice = skuPrice.filter(_sp => _sp.skuId === skuId && _sp.authorityId === authorityId)[0].price
    return mul(currentSkuPrice, skuNum || 1)
  })
  const _totalAmount = add(priceList)
  return _totalAmount
}

export function getPriceByAuthorityId(skuPriceList) {
  const userInfo = wx.getStorageSync("userInfo")
  const {
    authorityId
  } = userInfo
  const _findIndex = skuPriceList.findIndex(sp => sp.authorityId === authorityId)
  return skuPriceList[_findIndex].price
}