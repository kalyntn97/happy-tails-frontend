import { Alert, ImageSourcePropType } from "react-native"
import { Colors } from "@styles/index"

export const getColorArray = (): string[] => {
  const colorArrays = [
    Colors.greenArray, Colors.blueArray, Colors.pinkArray, Colors.yellowArray, Colors.purpleArray
  ]
  const randomIdx = Math.floor(Math.random() * colorArrays.length)
  return colorArrays[randomIdx]
}

export const getColor = (ref: number, value: number, colorArray: string[]): string => {
  const color = ref === value 
    ? colorArray[0] 
    : value === 0 
      ? colorArray[2] 
      : colorArray[1]
  return color
}

export const AlertForm = ({ body, button }) => 
  Alert.alert(
    'Alert',
    body,
    [{ text: button }]
  )

const iconSource = {
  //care
  'Teeth Brushing': require('@assets/icons/toothbrush.png'),
  'Nail Clipping': require('@assets/icons/clippers.png'),
  'Walk': require('@assets/icons/leash-walk.png'),
  'Grooming': require('@assets/icons/grooming.png'),
  'Litter Box Cleaning': require('@assets/icons/litter-box.png'),
  //health
  'Dental Cleaning': require('@assets/icons/dental-cleaning.png'),
  'Physical Exam': require('@assets/icons/physical-exam.png'),
  'Vaccine': require('@assets/icons/vaccine.png'),
  'Urinalysis': require('@assets/icons/urinalysis.png'),
  'Fecal Exam': require('@assets/icons/fecal-exam.png'),
  'Blood Testing': require('@assets/icons/blood-test.png'),
  'Others': require('@assets/icons/misc-exam.png'),
  //buttons
  'Add a Task':  require('@assets/icons/care-filled.png'),
  'Add a Vet Visit':  require('@assets/icons/vet-filled.png'),
  'Add a Pet':  require('@assets/icons/pet-filled.png'),
}

const petIconSource = {
  'Dog': require('@assets/icons/dog.png'),
  'Cat': require('@assets/icons/cat.png'),
  'Bird': require('@assets/icons/bird.png'),
  'Fish': require('@assets/icons/fish.png'),
  'Others': require('@assets/icons/animal.png'),
}


export const getIconSource = (name: string) => {
  return iconSource[name] || require('@assets/icons/paw.png')
}

export const getPetIconSource = (name: string) => {
  return petIconSource[name] || require('@assets/icons/paw.png')
}

