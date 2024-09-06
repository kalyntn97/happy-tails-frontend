import { useState } from "react"

const useForm = (callback: any, initialState: any) => {
  const [values, setValues] = useState<any>(initialState)

  const onChange = (name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
  }

  const onReset = () => {
    setValues(initialState)
  }

  const onValidate = ({ ...requiredFields }) => {
    const errors = Object.keys(requiredFields).reduce((acc, key) => {
      const value = requiredFields[key]
      if (Array.isArray(value) ? value.length === 0 : !value) {
        // acc[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`
        acc[key] = `Required field.`
      }
      return acc
    }, {})
    if (Object.keys(errors).length === 0) {
      setValues(prev => ({ ...prev, errors: {} }))
      callback()
    } else {
      setValues(prev => ({ ...prev, errors: errors }))
    }
  }
  
  return {
    onChange, onReset, values, onValidate
  }
}

export default useForm