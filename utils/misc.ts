import ToastManager, { Toast } from "toastify-react-native"
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

export const alertSuccess = (action: string, navigation?: any) => {
  AlertForm({ body: `${action} successfully`, button: 'OK' })
  if (navigation) return navigation.goBack()
}

export const showSuccessToast = (message: string) => {
  Toast.success(message)
}