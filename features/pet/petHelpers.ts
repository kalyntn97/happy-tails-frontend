//types
import { ImageSourcePropType } from "react-native"
import { BirdListResponse, CatBreed, DogBreedListResponse } from "./PetInterface"
import { keyFromName } from "@utils/misc"

export const getDogBreedData = async (): Promise<string[]> => {
  try {
    const res = await fetch('https://dog.ceo/api/breeds/list/all')
    const rawData: DogBreedListResponse = await res.json()
    if (!rawData.message) {
      throw new Error('Failed to fetch dog breed list')
    }
    const data = rawData.message
    const formattedData = Object.entries(data).flatMap(( [breed, subBreeds] ) => {
      if (subBreeds.length > 0) {
        return subBreeds.map(subBreed => (
          `${subBreed.charAt(0).toUpperCase() + subBreed.slice(1)} ${breed.charAt(0).toUpperCase() + breed.slice(1)}`
        ))
      } else {
        return `${breed.charAt(0).toUpperCase() + breed.slice(1)}`
      }
    })
    return formattedData.sort()
  } catch (error) {
    console.error(error)
    throw new Error('Failed to fetch dog breed data')
  }
}

export const getCatBreedData = async (): Promise<string[]> => {
  try {
    const res = await fetch('https://api.thecatapi.com/v1/breeds')
    const rawData: CatBreed[] = await res.json()
    const data = rawData.map((item) => item.name)
    data.push('Domestic Shorthair', 'Domestic Longhair')
    return data.sort()
  } catch (error) {
    console.error(error)
    throw new Error('Failed to fetch cat breed data')
  }
}

export const getBirdSpeciesData = async (): Promise<string[]> => {
  try {
    const res = await fetch('https://feederwatch.org/wp-content/themes/feederwatch/js/common-feeder-birds-image-credit.json')
    const rawData: BirdListResponse = await res.json()
    const data = rawData.commonFeederBirds.map(item => item.commonNameEnglish)
    data.push('Unknown')
    return data.sort()
  } catch (error) {
    console.error(error)
    throw new Error('Failed to fetch bird data')
  }
}

export const FISH_SPECIES: string[] = ["Adolfo's cory", "Adonis tetra", "African peacock cichlid", "Angelfish", "Archerfish", "Atlantic mudskipper", "Auratus cichlid", "Australian rainbowfish", "Azureus cichlid", "Bandit cory", "Barb - gold", "Barb - rosy", "Barb - tiger", "Betta - female", "Betta - male", "Black-banded leporinus", "Black neon tetra", "Black phantom tetra", "Black skirt tetra", "Black widow tetra", "Blind cavefish", "Blood parrot cichlid", "Blue gourami - albino morph", "Blue gourami - cosby hybrid", "Blue gourami - traditional color", "Boeseman's rainbowfish", "Bronze cory", "Cardinal tetra", "Catfish - upside down", "Cavefish - blind", "Cichlid - five-bar", "Cichlid - purple", "Cichlid - Six-bar", "Clown loach", "Cory - Bandit", "Cory - Bronze", "Danio - pearl", "Danio - zebra", "Debauwi catfish", "Deepwater haplochromis", "Denison's flying fox", "Dojo loach", "Dovii loach", "Dragonfish", "Dusky piranha", "Dwarf croaking gourami", "Dwarf gourami", "Dwarf pencilfish", "Dwarf snakehead", "Eartheater", "Eastern mudminnow", "Edible gourami", "Eduard's mbuna", "Ell loach", "Egyptian mouthbrooder", "Eight-barb loach", "Electric blue hap", "Electric catfish", "Electric yellow haplochromis", "Elegant rasbora", "Elephant-nose", "Emperor tetra", "Fairy cichlid", "False bumblebee catfish", "Fathead bichir", "Fighting fish", "Figure eight puffer", "Five-bar cichlid", "Five-stripe lamprologus", "Gold barb", "Gourami - blue", "Gourami - dwarf", "Gourami - gold", "Gourami - kissing", "Gourami - leeri", "Gourami - marbeled", "Gourami - moonlight", "Gourami - opaline", "Gourami - pearl", "Gourami - three spot", "Haitian cichlid", "Half-lined pyrrhulina", "Hampala barb", "Harlequin rasbora", "Harlequin shark", "Harrison's pencilfish", "Hatchetfish", "Heterotis bonytongue", "Hi-fin banded shark", "Jack Dempsey cichlid", "Jae barb", "Jaguar catfish", "Jelly bean tetra", "Jewel cichlid", "Johanni mbuna cichlid", "Jordan's catfish", "Jumping characin", "Kafirnigani gray loach", "Katangae Nile bichir", "Keyhole cichlid", "Kissing gourami", "Kribensis cichlid", "Labidochromis sp \"Yellow\" cichlid", "Labidochromis yellow fish", "Lamprologus - five-stripe", "Lamprologus - six-stripe", "Leeri pearl gourami", "Leporinus - black-banded", "Loach - clown", "Loach - dojo", "Loach - weather", "Marbled gourami", "Marigold lyretail swordtail", "Marigold wag swordtail", "Melanotaenia splendida tatei", "Moonlight gourami", "Nandus", "Needle fin eater", "Needlefish", "Neon tetra - black", "Nigerian red krib", "Nile puffer", "Nyerere's Victoria cichlid", "Obese syndontis", "Obliquidens hap", "Obscure snakehead", "Ocellated freshwater stingray", "Ocellated shell-dweller", "Ocellated synodontis", "Opaline gourami", "Oxeye herring", "Ozola barb", "Palembang puffer", "Papuan rainbowfish", "Parrot - blood", "Pearl danio", "Pearl gourami", "Platy - red wagtail", "Puffer - figure eight", "Purple cichlid", "Rainbowfish - Papuan", "Rasbora - red", "Red eye tetra", "Red rasbora", "Red wagtail platy", "Rosy barb", "Schwanefeld's barb", "Siamese fighting fish", "Silver dollar - Metynnis argenteus", "Six-bar cichlid", "Six-stripe lamprologus cichlid", "Swordtail - marigold lyertail", "Swordtail - marigold wag", "Tetra - black neon", "Tetra - black phantom", "Tetra - black skirt", "Tetra - black widow", "Tetra - cardinal", "Tetra - emperor", "Emperor Tetra", "Tetra - red eye", "Tetra - white skirt", "Three spot gourami", "Tiger barb", "Uaru cichlid", "Unicorn fish", "Unknown", "Upside down catfish", "Vampire pleco", "Variegated platy", "Variegated shark", "Venustus", "Violet goby", "Wallago catfish", "Warmouth", "Weather fish", "Weather loach", "West African bichir", "West Australian pygmy perch", "White skirt tetra", "Whiptailed banjo catfish", "Yellow banded moenkhausia", "Yellow Julie cichlid", "Yellow king piranha", "Yellow kribensis", "Yellow lab", "Yellow regal peacock cichlid", "Yellow-finned xenotilapia", "Yellow-tailed conga tetra", "Yo-yo loach", "Zebra danio"]


export const SPECIES = [ 'Dog', 'Cat', 'Bird', 'Fish' ]
export const SPECIES_OPTIONS = [...SPECIES, 'Others']

export const STATUS = [ 'Healthy', 'Passed away' ]

export const IDS = ['Microchip', 'License', 'Passport', 'Others']

export const MED_STATUS = ['Active', 'Paused', 'Inactive']

export const DISEASE_TYPES = ['Skeletal/ muscular', 'Cardiovascular', 'Neurological', 'Eyes', 'Ears', 'Skin', 'Endocrine', 'Gastrointestinal', 'Urinary/ Reproductive', 'Cancer', 'Behavioral', 'Poison', 'Allergy', 'Autoimmune', 'Diabetes', 'Liver', 'Trauma/ Injury'].sort()

export const DISEASE_STATUS = ['Active', 'Cured', 'Chronic']

export const SERVICE_TYPES = ['ER Hospital', 'Clinic', 'School', 'Boarding', 'Groomer', 'Sitter', 'Pet store']

export const PET_DETAILS = {
  id: 'Pet Identifications',
  med: 'Pet Medications',
  service: 'Pet Services',
  illness: 'Pet Conditions',
}

export const getDetailHeader = (key: string) => {
  return PET_DETAILS[key]
}
