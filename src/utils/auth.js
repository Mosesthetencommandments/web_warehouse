import Cookies from 'js-cookie'

const userTokenKey = 'User-Token'
const accountTokenKey = 'Account-Token'
const theme = 'Bzt-Theme'


export function getUserToken() {
  return Cookies.get(userTokenKey, { domain: process.env.COOKIE_DOMAIN })
}
export function setUserToken(token) {
  let d = new Date();
  d.setTime(d.getTime() + ( 10 * 3600 * 1000));
  return Cookies.set(userTokenKey, token, { domain: process.env.COOKIE_DOMAIN, expires: d  })
}
export function removeUserToken() {
  return Cookies.remove(userTokenKey, { domain: process.env.COOKIE_DOMAIN })
}

export function getAccountToken() {
  return Cookies.get(accountTokenKey)
}
export function setAccountToken(token) {
  let d = new Date();
  d.setTime(d.getTime() + ( 10 * 3600 * 1000));
  return Cookies.set(accountTokenKey, token, { expires: d  })
}
export function removeAccountToken() {
  return Cookies.remove(accountTokenKey)
}

export function getTheme() {
  return Cookies.get(theme)
}
export function setTheme(color) {
  let d = new Date();
  d.setTime(d.getTime() + ( 24 * 3600 * 1000 * 365));
  return Cookies.set(theme, color, { expires: d })
}
