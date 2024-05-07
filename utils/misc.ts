import { AlertForm } from "./ui"

export const keyFromName = (data: {[key: string]: string}) => {
  const map = {}
  for (const key in data) {
    const name = data[key]
    map[name] = key
  }
  return map
} 

export const alertError = (error: Error) => {
  return AlertForm({ body: `Error: ${error}`, button: 'Retry' })
}

export const alertSuccess = (action: string, navigation: any) => {
  navigation.goBack()
  return AlertForm({ body: `${action} successfully`, button: 'OK' })
}