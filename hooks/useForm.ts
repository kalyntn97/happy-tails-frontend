import { useState } from "react"

const useForm = (callback: any, initialState: any) => {
  const [values, setValues] = useState<any>(initialState)

  const onChange = (name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
  }

  const onReset = () => {
    setValues(initialState)
  }

  const onValidate = (...requiredFields) => {
    if (requiredFields.some(value => !value)) {
      setValues(prev => ({ ...prev, errorMsg: 'Please enter all required fields' }))
    } else {
      setValues(prev => ({ ...prev, errorMsg: null }))
      callback()
    }
  }

  return {
    onChange, onReset, values, onValidate
  }
}

export default useForm