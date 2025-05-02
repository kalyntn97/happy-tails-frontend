import { Colors } from "@styles/index"
import { Alert } from "react-native"

export const getColorArray = (): string[] => {
  const colorArrays = [
    Object.values(Colors.green),
    Object.values(Colors.blue),
    Object.values(Colors.pink),
    Object.values(Colors.yellow),
    Object.values(Colors.purple)
  ]
  const randomIdx = Math.floor(Math.random() * colorArrays.length)
  return colorArrays[randomIdx]
}

export const getColor = (ref: number, value: number, colorArray: string[]): string => {
  const color = ref === value 
    ? colorArray[2]
    : value === 0 
      ? colorArray[4] 
      : colorArray[3]
  return color
}

export const AlertForm = ({ body, button }) => 
  Alert.alert(
    'Alert',
    body,
    [{ text: button }]
  )

const actionIconSource = {
  // colored icons
  careColor: require('@assets/icons/action-care_color.png'),
  healthColor: require('@assets/icons/action-health_color.png'),
  birthdayColor: require('@assets/icons/action-birthday_color.png'),
  checkColor: require('@assets/icons/action-check_color.png'),
  deleteColor: require('@assets/icons/action-delete_color.png'),
  repeatColor: require('@assets/icons/action-repeat_color.png'),
  frequencyColor: require('@assets/icons/action-frequency_color.png'),
  dueColor: require('@assets/icons/action-calendar_due.png'),
  noteColor: require('@assets/icons/action-note_color.png'),
  increase: require('@assets/icons/action-increase.png'),
  decrease: require('@assets/icons/action-decrease.png'),
  // info icons
  no: require('@assets/icons/action-no.png'),
  tag: require('@assets/icons/action-tag.png'),
  status: require('@assets/icons/action-status.png'),
  check: require('@assets/icons/action-check.png'),
  color: require('@assets/icons/action-color.png'),
  repeat: require('@assets/icons/action-repeat.png'),
  due: require('@assets/icons/action-due.png'),
  settings: require('@assets/icons/action-settings.png'),
  camera: require('@assets/icons/action-camera.png'),
  info: require('@assets/icons/action-info.png'),
  home: require('@assets/icons/action-home.png'),
  email: require('@assets/icons/action-email.png'),
  phone: require('@assets/icons/action-phone.png'),
  address: require('@assets/icons/action-address.png'),
  birthday: require('@assets/icons/action-birthday.png'),
  adopt: require('@assets/icons/action-adopt_date.png'),
  altered: require('@assets/icons/action-altered.png'),
  gender: require('@assets/icons/action-gender.png'),
  details: require('@assets/icons/action-details.png'),
  detailsPet: require('@assets/icons/pet-details.png'),
  logPet: require('@assets/icons/pet-log.png'),
  care: require('@assets/icons/action-care.png'),
  health: require('@assets/icons/action-health.png'),
  vet: require('@assets/icons/action-vet.png'),
  pet: require('@assets/icons/action-pets.png'),
  petType: require('@assets/icons/action-pet_type.png'),
  healthType: require('@assets/icons/action-health_type.png'),
  healthRecord: require('@assets/icons/action-health_record.png'),
  schedule: require('@assets/icons/action-schedule.png'),
  id: require('@assets/icons/action-pet_id.png'),
  service: require('@assets/icons/action-pet_service.png'),
  medication: require('@assets/icons/action-pet_med.png'),
  condition: require('@assets/icons/action-pet_condition.png'),
  allergy: require('@assets/icons/action-pet_allergy.png'),
  chart: require('@assets/icons/action-chart.png'),
  freq: require('@assets/icons/action-calendar_freq.png'),
  done: require('@assets/icons/action-calendar_done.png'),
  date: require('@assets/icons/action-calendar_date.png'),
  overdue: require('@assets/icons/action-calendar_overdue.png'),
  skipped: require('@assets/icons/action-calendar_skipped.png'),
  'Add a Task': require('@assets/icons/care-filled.png'),
  'Add a Vet Visit': require('@assets/icons/health-filled.png'),
  'Add a Pet': require('@assets/icons/pet-filled.png'),
  // action icons
  action: require('@assets/icons/action-action.png'),
  add: require('@assets/icons/action-add.png'),
  edit: require('@assets/icons/action-edit.png'),
  close: require('@assets/icons/action-close.png'),
  cancel: require('@assets/icons/action-cancel.png'),
  delete: require('@assets/icons/action-delete.png'),
  archive: require('@assets/icons/action-archive.png'),
  reminder: require('@assets/icons/action-reminder.png'),
  note: require('@assets/icons/action-note.png'),
  save: require('@assets/icons/action-save.png'),
  show: require('@assets/icons/action-show.png'),
  hide: require('@assets/icons/action-hide.png'),
  filter: require('@assets/icons/action-filter.png'),
  search: require('@assets/icons/action-search.png'),
  reset: require('@assets/icons/action-reset.png'),
  back: require('@assets/icons/action-back.png'),
  up: require('@assets/icons/action-up.png'),
  down: require('@assets/icons/action-down.png'),
  next: require('@assets/icons/action-next.png'),
  nextRound: require('@assets/icons/action-next_round.png'),
  prev: require('@assets/icons/action-prev.png'),
  prevRound: require('@assets/icons/action-prev_round.png'),
}

const careIconSource = {
  teeth: require('@assets/icons/care-brush_teeth.png'),
  nail: require('@assets/icons/care-clip_nail.png'),
  walk: require('@assets/icons/care-walk.png'),
  groom: require('@assets/icons/care-groom.png'),
  litter: require('@assets/icons/care-clean_litter_box.png'),
  bath: require('@assets/icons/care-give_bath.png'),
  brush: require('@assets/icons/care-brush_coat.png'),
  meds: require('@assets/icons/care-med.png'),
  refillMed: require('@assets/icons/care-med.png'),
  train: require('@assets/icons/care-train.png'),
  feed: require('@assets/icons/care-feed.png'),
  others: require('@assets/icons/care-others.png'),
}

const healthIconSource = {
  Routine: require('@assets/icons/health-type-routine.png'),
  Emergency: require('@assets/icons/health-type-emergency.png'),
  Illness: require('@assets/icons/health-type-illness.png'),
  dental: require('@assets/icons/health-dental_cleaning.png'),
  physical: require('@assets/icons/health-physical_exam.png'),
  vax: require('@assets/icons/health-vaccine.png'),
  skin: require('@assets/icons/health-skin_exam.png'),
  urine: require('@assets/icons/health-urinalysis.png'),
  fecal: require('@assets/icons/health-fecal_exam.png'),
  blood: require('@assets/icons/health-blood_test.png'),
  ultra: require('@assets/icons/health-ultrasound.png'),
  xray: require('@assets/icons/health-xray.png'),
  iv: require('@assets/icons/health-iv_drip.png'),
  others: require('@assets/icons/health-misc_exam.png'),
}

const navigationIconSource = {
  Feed: {
    'active': require('@assets/icons/nav-home-active.png'),
    'inactive': require('@assets/icons/nav-home-inactive.png'),
  },
  Pets: {
    'active': require('@assets/icons/nav-pets-active.png'),
    'inactive': require('@assets/icons/nav-pets-inactive.png'),
  },
  Profile: {
    'active': require('@assets/icons/nav-profile-active.png'),
    'inactive': require('@assets/icons/nav-profile-inactive.png'),
  },
  Account: {
    'active': require('@assets/icons/nav-account-active.png'),
    'inactive': require('@assets/icons/nav-account-inactive.png'),
  },
  care: {
    'active': require('@assets/icons/nav-care-active.png'),
    'inactive': require('@assets/icons/nav-care-inactive.png'),
  },
  health: {
    'active': require('@assets/icons/nav-health-active.png'),
    'inactive': require('@assets/icons/nav-health-inactive.png'),
  },
}

const calendarIconSource = {
  day: { 
    'active': require('@assets/icons/calendar-day-active.png'),
    'inactive': require('@assets/icons/calendar-day-inactive.png'),
  },
  week: { 
    'active': require('@assets/icons/calendar-week-active.png'),
    'inactive': require('@assets/icons/calendar-week-inactive.png'),
  },
  month: {
    'active': require('@assets/icons/calendar-month-active.png'),
    'inactive': require('@assets/icons/calendar-month-inactive.png'),
  },
  year: { 
    'active': require('@assets/icons/calendar-year-active.png'),
    'inactive': require('@assets/icons/calendar-year-inactive.png'),
  },
  others: {
    'active': require('@assets/icons/calendar-others-active.png'),
    'inactive': require('@assets/icons/calendar-others-inactive.png'),
  },
}

export const statIconSource = {
  mood: require('@assets/icons/stat-mood.png'),
  appetite: require('@assets/icons/stat-appetite.png'),
  energy: require('@assets/icons/stat-energy.png'),
  sleep: require('@assets/icons/stat-sleep.png'),
  vomit: require('@assets/icons/stat-vomit.png'),
  urine: require('@assets/icons/stat-urine.png'),
  feces: require('@assets/icons/stat-feces.png'),
  water: require('@assets/icons/stat-water.png'),
  weight: require('@assets/icons/stat-weight.png'),
  dryFood: require('@assets/icons/stat-dry_food.png'),
  wetFood: require('@assets/icons/stat-wet_food.png'),
  treats: require('@assets/icons/stat-treats.png'),
}

export const statValueIconSource = {
  heart: {
    0: require('@assets/icons/stat-heart-0.png'),
    1: require('@assets/icons/stat-heart-1.png'),
  },
  paw: {
    0: require('@assets/icons/stat-paw-0.png'),
    1: require('@assets/icons/stat-paw-1.png'),
  },
  mood: {
    0: require('@assets/icons/stat-mood-0.png'),
    1: require('@assets/icons/stat-mood-1.png'),
    2: require('@assets/icons/stat-mood-2.png'),
    3: require('@assets/icons/stat-mood-3.png'),
    4: require('@assets/icons/stat-mood-4.png'),
  },
  appetite: {
    0: require('@assets/icons/stat-appetite-0.png'),
    1: require('@assets/icons/stat-appetite-1.png'),
  },
  energy: {
    0: require('@assets/icons/stat-energy-0.png'),
    1: require('@assets/icons/stat-energy-1.png'),
  },
  sleep: {
    0: require('@assets/icons/stat-sleep-0.png'),
    1: require('@assets/icons/stat-sleep-1.png'),
  },
}

const petIconSource = {
  Dog: require('@assets/icons/pet-dog.png'),
  Cat: require('@assets/icons/pet-cat.png'),
  Bird: require('@assets/icons/pet-bird.png'),
  Fish: require('@assets/icons/pet-fish.png'),
  Rodent: require('@assets/icons/pet-rodent.png'),
  Others: require('@assets/icons/pet-others.png'),
  DogProfile: require('@assets/icons/pet-dog_profile.png'),
  CatProfile: require('@assets/icons/pet-cat_profile.png'),
  OtherProfile: require('@assets/icons/pets.png'),
  id: require('@assets/icons/pet-id.png'),
  Microchip: require('@assets/icons/id-microchip.png'),
  Passport: require('@assets/icons/id-passport.png'),
  License: require('@assets/icons/id-license.png'),
  Identification: require('@assets/icons/id-id.png'),
  service: require('@assets/icons/pet-service.png'),
  Groomer: require('@assets/icons/service-groomer.png'),
  Boarding: require('@assets/icons/service-boarding.png'),
  School: require('@assets/icons/service-school.png'),
  medication: require('@assets/icons/care-med.png'),
  condition: require('@assets/icons/pet-condition.png'),
  allergy: require('@assets/icons/pet-allergy.png'),
  Food: require('@assets/icons/allergy-food.png'),
  Environmental: require('@assets/icons/allergy-environmental.png'),
  'Flea/ Insect': require('@assets/icons/allergy-flea.png'),
  Contact: require('@assets/icons/allergy-contact.png'),
  Drug: require('@assets/icons/allergy-drug.png'),
  Asthma: require('@assets/icons/allergy-asthma.png'),
  'Pet Store': require('@assets/icons/service-store.png'),
  'ER Hospital': require('@assets/icons/service-er.png'),
  Clinic: require('@assets/icons/service-clinic.png'),
  Sitter: require('@assets/icons/service-sitter.png')
}

export const getActionIconSource = (name: string) => {
  return actionIconSource[name]
}

export const getCareIconSource = (name: string) => {
  return careIconSource[name] || careIconSource['others']
}
export const getHealthIconSource = (name: string) => {
  return healthIconSource[name] || healthIconSource['others']
}

export const getNavigationIconSource = (name: string, status: string) => {
  return navigationIconSource[name][status] || require('@assets/icons/nav-account-active.png')
}

export const getPetIconSource = (name: string) => {
  return petIconSource[name]
}

export const getCalendarIconSource = (name: string, status: string) => {
  return calendarIconSource[name][status] || calendarIconSource['others'][status]
}

export const getStatIconSource = (name: string) => {
  return statIconSource[name]
}

export const getStatValueIconSource = (name: string, value: number) => {
  return statValueIconSource[name][value]
}

export type IconType = 'action' | 'care' | 'health' | 'pet' | 'stat' | 'statValue' | 'nav'  

const iconMap = {
  action: (name: string) => getActionIconSource(name),
  care: (name: string) => getCareIconSource(name),
  health: (name: string) => getHealthIconSource(name),
  pet: (name: string) => getPetIconSource(name),
  allergy: (name: string) => getPetIconSource(name) || petIconSource['allergy'],
  stat: (name: string) => getStatIconSource(name),
  statValue: (name: string, value: number) => getStatValueIconSource(name, value),
  nav: (name: string, value: any) => getNavigationIconSource(name, value)
}

export const getIconByType = (type: IconType, name: string, value?: any) => {
  const iconSource = iconMap[type]
  if (!iconSource) console.error(`Icon type ${type} not found.`)
  return iconSource(name, value) || null
}

