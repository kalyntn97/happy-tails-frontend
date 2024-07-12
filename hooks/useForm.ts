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
    if (Object.values(requiredFields).every(value => !!value)) {
      setValues(prev => ({ ...prev, errors: null }))
      callback()
    } else {
      setValues(prev => ({ ...prev, errors: 
        Object.keys(requiredFields)
        .filter(key => !requiredFields[key])
        .reduce((acc, key) => {
          acc[key] = `${key} is required`
          return acc
        }, {}) 
      }))
      return
    }
  }

  return {
    onChange, onReset, values, onValidate
  }
}

export default useForm