import { Alert, ImageSourcePropType } from "react-native"
import { Colors } from "@styles/index"

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
  actionSquare: require('@assets/icons/action-action_square.png'),
  close: require('@assets/icons/action-close.png'),
  check: require('@assets/icons/action-check.png'),
  increase: require('@assets/icons/action-increase.png'),
  decrease: require('@assets/icons/action-decrease.png'),
  add: require('@assets/icons/action-add.png'),
  delete: require('@assets/icons/action-delete.png'),
  edit: require('@assets/icons/action-edit.png'),
  editSquare: require('@assets/icons/action-edit_square.png'),
  deleteColor: require('@assets/icons/action-delete_color.png'),
  deleteSquare: require('@assets/icons/action-delete_square.png'),
  show: require('@assets/icons/action-show.png'),
  hide: require('@assets/icons/action-hide.png'),
  filter: require('@assets/icons/action-filter.png'),
  details: require('@assets/icons/action-details.png'),
  detailsPet: require('@assets/icons/pet-details.png'),
  logPet: require('@assets/icons/pet-log.png'),
  repeat: require('@assets/icons/action-repeat.png'),
  repeatSquare: require('@assets/icons/action-repeat_square.png'),
  save: require('@assets/icons/action-save.png'),
  saveSquare: require('@assets/icons/action-save_square.png'),
  undo: require('@assets/icons/action-undo.png'),
  search: require('@assets/icons/action-search.png'),
  back: require('@assets/icons/action-back.png'),
  up: require('@assets/icons/action-up.png'),
  down: require('@assets/icons/action-down.png'),
  next: require('@assets/icons/action-next.png'),
  nextRound: require('@assets/icons/action-next_round.png'),
  prev: require('@assets/icons/action-prev.png'),
  prevRound: require('@assets/icons/action-prev_round.png'),
  freq: require('@assets/icons/action-calendar_freq.png'),
  due: require('@assets/icons/action-calendar_due.png'),
  done: require('@assets/icons/action-calendar_done.png'),
  overdue: require('@assets/icons/action-calendar_overdue.png'),
  skipped: require('@assets/icons/action-calendar_skipped.png'),
  date: require('@assets/icons/action-calendar_date.png'),
  chart: require('@assets/icons/action-chart.png'),
  note: require('@assets/icons/action-note.png'),
  noteSquare: require('@assets/icons/action-note_square.png'),
  log: require('@assets/icons/action-log.png'),
  health: require('@assets/icons/action-health.png'),
  care: require('@assets/icons/action-care.png'),
  home: require('@assets/icons/action-home.png'),
  settings: require('@assets/icons/action-settings.png'),
  pets: require('@assets/icons/action-pets.png'),
  schedule: require('@assets/icons/action-schedule.png'),
  allergies: require('@assets/icons/action-pet_allergy.png'),
  ids: require('@assets/icons/action-pet_id.png'),
  illnesses: require('@assets/icons/action-pet_illness.png'),
  meds: require('@assets/icons/action-pet_med.png'),
  services: require('@assets/icons/action-pet_service.png'),
  'Add a Task': require('@assets/icons/care-filled.png'),
  'Add a Vet Visit': require('@assets/icons/health-filled.png'),
  'Manage Pets': require('@assets/icons/pet-filled.png'),
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
  others: require('@assets/icons/health-misc_exam.png'),
}
const healthIconSource = {
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
}

const navigationIconSource = {
  Home: {
    'active': require('@assets/icons/nav-home-active.png'),
    'inactive': require('@assets/icons/nav-home-inactive.png'),
  },
  Pets: {
    'active': require('@assets/icons/nav-pets-active.png'),
    'inactive': require('@assets/icons/nav-pets-inactive.png'),
  },
  User: {
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

export const statQualIconSource = {
  heart: [
    require('@assets/icons/stat-heart-0.png'),
    require('@assets/icons/stat-heart-1.png'),
  ],
  paw: [
    require('@assets/icons/stat-paw-0.png'),
    require('@assets/icons/stat-paw-1.png'),
  ],
  mood: [
    require('@assets/icons/stat-mood-0.png'),
    require('@assets/icons/stat-mood-1.png'),
    require('@assets/icons/stat-mood-2.png'),
    require('@assets/icons/stat-mood-3.png'),
    require('@assets/icons/stat-mood-4.png'),
  ],
  appetite: [
    require('@assets/icons/stat-appetite-0.png'),
    require('@assets/icons/stat-appetite-1.png'),
  ],
  energy: [
    require('@assets/icons/stat-energy-0.png'),
    require('@assets/icons/stat-energy-1.png'),
  ],
  sleep: [
    require('@assets/icons/stat-sleep-0.png'),
    require('@assets/icons/stat-sleep-1.png'),
  ],
}

const petIconSource = {
  Dog: require('@assets/icons/pet-dog.png'),
  Cat: require('@assets/icons/pet-cat.png'),
  Bird: require('@assets/icons/pet-bird.png'),
  Fish: require('@assets/icons/pet-fish.png'),
  Others: require('@assets/icons/pet-animal.png'),
  DogProfile: require('@assets/icons/pet-dog_profile.png'),
  CatProfile: require('@assets/icons/pet-cat_profile.png'),
  AnimalProfile: require('@assets/icons/pets.png'),
  meds: require('@assets/icons/care-med.png'),
  allergies: require('@assets/icons/pet-allergy.png'),
  illnesses: require('@assets/icons/illness.png'),
  ids: require('@assets/icons/id.png'),
  Microchip: require('@assets/icons/id-microchip.png'),
  Passport: require('@assets/icons/id-passport.png'),
  License: require('@assets/icons/id-license.png'),
  Id: require('@assets/icons/id-id.png'),
  services: require('@assets/icons/service.png'),
  Groomer: require('@assets/icons/service-salon.png'),
  Boarding: require('@assets/icons/service-boarding.png'),
  'Pet Store': require('@assets/icons/service-store.png'),
  'ER Hospital': require('@assets/icons/service-er.png'),
  Clinic: require('@assets/icons/service-vet.png'),
  Sitter: require('@assets/icons/service-sitter.png')
}

export const getActionIconSource = (name: string) => {
  return actionIconSource[name]
}

export const getCareIconSource = (name: string) => {
  return careIconSource[name] || careIconSource['others']
}
export const getHealthIconSource = (name: string) => {
  return healthIconSource[name] || require('@assets/icons/health-misc_exam.png')
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

export const getStatQualIconSource = (name: string, value: number) => {
  return statQualIconSource[name][value]
}
