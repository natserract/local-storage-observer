import * as CryptoJS from 'crypto-js'
import { SECRET_KEY } from '../environment'
import { serialize } from './serialize'

export const encryptData = (data: string | null | any) => {
  try {
    return CryptoJS.AES.encrypt(serialize(data), SECRET_KEY).toString()
  } catch (error) {
    return undefined
  }
}

export const decryptData = (data: string | null | any) => {
  try {
    if (data) {
      const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY)
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
      }
    }
    return data
  } catch (error) {
    return undefined
  }
}
