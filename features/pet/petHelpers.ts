//types
import { CatBreed, ConditionStatus, DogBreedListResponse, Gender, HealthCondition, Status } from "./PetInterface"

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
    console.error('Failed to fetch dog breed data', error)
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
    console.error('Failed to fetch cat breed data', error)
  }
}

export const BIRD_SPECIES: string[] = ["Red-winged Blackbird", "Sandhill Crane", "Chipping Sparrow", "Bobolink", "American White Pelican", "Sharp-Shinned Hawk", "Common Redpoll", "Hairy Woodpecker", "Cedar Waxwing", "Tufted Titmouse", "Song Sparrow", "White-breasted Nuthatch", "Eastern Screech Owl", "Harris’ Sparrow", "Snow Bunting", "Black-capped Chickadee", "Grey Catbird", "Blue Jay", "Brown Creeper", "Great Horned Owl", "Sandhill Crane", "American Crow", "White-Crowned Sparrow", "Chimney Swift", "Baltimore Oriole", "Northern Cardinal", "Wild Turkey", "Pine Siskin", "Purple Finch", "Eastern Bluebird", "Rose-breasted Grosbeak", "Mourning Dove", "Red-tailed Hawk", "Dark-eyed Junco", "Ruby-throated Hummingbird", "House Wren", "House Finch", "Downy Woodpecker", "Red-breasted Nuthatch", "Belted Kingfisher", "Brown-headed Cowbird", "Common Nighthawk", "Purple Martin", "Brown Thrasher", "American Kestrel", "Blue Jay", "Ring-necked Pheasant", "American Goldfinch"]


export const FISH_SPECIES: string[] = ["Adolfo's cory", "Adonis tetra", "African peacock cichlid", "Angelfish", "Archerfish", "Atlantic mudskipper", "Auratus cichlid", "Australian rainbowfish", "Azureus cichlid", "Bandit cory", "Barb - gold", "Barb - rosy", "Barb - tiger", "Betta - female", "Betta - male", "Black-banded leporinus", "Black neon tetra", "Black phantom tetra", "Black skirt tetra", "Black widow tetra", "Blind cavefish", "Blood parrot cichlid", "Blue gourami - albino morph", "Blue gourami - cosby hybrid", "Blue gourami - traditional color", "Boeseman's rainbowfish", "Bronze cory", "Cardinal tetra", "Catfish - upside down", "Cavefish - blind", "Cichlid - five-bar", "Cichlid - purple", "Cichlid - Six-bar", "Clown loach", "Cory - Bandit", "Cory - Bronze", "Danio - pearl", "Danio - zebra", "Debauwi catfish", "Deepwater haplochromis", "Denison's flying fox", "Dojo loach", "Dovii loach", "Dragonfish", "Dusky piranha", "Dwarf croaking gourami", "Dwarf gourami", "Dwarf pencilfish", "Dwarf snakehead", "Eartheater", "Eastern mudminnow", "Edible gourami", "Eduard's mbuna", "Ell loach", "Egyptian mouthbrooder", "Eight-barb loach", "Electric blue hap", "Electric catfish", "Electric yellow haplochromis", "Elegant rasbora", "Elephant-nose", "Emperor tetra", "Fairy cichlid", "False bumblebee catfish", "Fathead bichir", "Fighting fish", "Figure eight puffer", "Five-bar cichlid", "Five-stripe lamprologus", "Gold barb", "Gourami - blue", "Gourami - dwarf", "Gourami - gold", "Gourami - kissing", "Gourami - leeri", "Gourami - marbeled", "Gourami - moonlight", "Gourami - opaline", "Gourami - pearl", "Gourami - three spot", "Haitian cichlid", "Half-lined pyrrhulina", "Hampala barb", "Harlequin rasbora", "Harlequin shark", "Harrison's pencilfish", "Hatchetfish", "Heterotis bonytongue", "Hi-fin banded shark", "Jack Dempsey cichlid", "Jae barb", "Jaguar catfish", "Jelly bean tetra", "Jewel cichlid", "Johanni mbuna cichlid", "Jordan's catfish", "Jumping characin", "Kafirnigani gray loach", "Katangae Nile bichir", "Keyhole cichlid", "Kissing gourami", "Kribensis cichlid", "Labidochromis sp \"Yellow\" cichlid", "Labidochromis yellow fish", "Lamprologus - five-stripe", "Lamprologus - six-stripe", "Leeri pearl gourami", "Leporinus - black-banded", "Loach - clown", "Loach - dojo", "Loach - weather", "Marbled gourami", "Marigold lyretail swordtail", "Marigold wag swordtail", "Melanotaenia splendida tatei", "Moonlight gourami", "Nandus", "Needle fin eater", "Needlefish", "Neon tetra - black", "Nigerian red krib", "Nile puffer", "Nyerere's Victoria cichlid", "Obese syndontis", "Obliquidens hap", "Obscure snakehead", "Ocellated freshwater stingray", "Ocellated shell-dweller", "Ocellated synodontis", "Opaline gourami", "Oxeye herring", "Ozola barb", "Palembang puffer", "Papuan rainbowfish", "Parrot - blood", "Pearl danio", "Pearl gourami", "Platy - red wagtail", "Puffer - figure eight", "Purple cichlid", "Rainbowfish - Papuan", "Rasbora - red", "Red eye tetra", "Red rasbora", "Red wagtail platy", "Rosy barb", "Schwanefeld's barb", "Siamese fighting fish", "Silver dollar - Metynnis argenteus", "Six-bar cichlid", "Six-stripe lamprologus cichlid", "Swordtail - marigold lyertail", "Swordtail - marigold wag", "Tetra - black neon", "Tetra - black phantom", "Tetra - black skirt", "Tetra - black widow", "Tetra - cardinal", "Tetra - emperor", "Emperor Tetra", "Tetra - red eye", "Tetra - white skirt", "Three spot gourami", "Tiger barb", "Uaru cichlid", "Unicorn fish", "Unknown", "Upside down catfish", "Vampire pleco", "Variegated platy", "Variegated shark", "Venustus", "Violet goby", "Wallago catfish", "Warmouth", "Weather fish", "Weather loach", "West African bichir", "West Australian pygmy perch", "White skirt tetra", "Whiptailed banjo catfish", "Yellow banded moenkhausia", "Yellow Julie cichlid", "Yellow king piranha", "Yellow kribensis", "Yellow lab", "Yellow regal peacock cichlid", "Yellow-finned xenotilapia", "Yellow-tailed conga tetra", "Yo-yo loach", "Zebra danio"]


export const SPECIES = [ 'Dog', 'Cat', 'Bird', 'Fish', 'Rodent' ]
export const SPECIES_OPTIONS = SPECIES.map(name => {
  return { title: name, icon: null, type: 'pet' }
})

export const GENDER: Gender[] = ['Boy', 'Girl', 'Unknown']

export const STATUS: Status[] = [ 'Healthy', 'Passed away' ]

export const IDS = ['Identification', 'Microchip', 'License', 'Passport', 'Other']

export const MEDICATION_STATUS = ['Active', 'Paused', 'Inactive']

export const HEALTH_CONDITION_TYPES: string[] = ['Skeletal/ muscular', 'Cardiovascular', 'Neurological', 'Eyes', 'Ears', 'Skin', 'Endocrine', 'Gastrointestinal', 'Urinary/ Reproductive', 'Cancer', 'Behavioral', 'Poison', 'Allergy', 'Autoimmune', 'Diabetes', 'Liver', 'Trauma/ Injury'].sort()

export const HEALTH_CONDITION_STATUS: ConditionStatus[] = ['Acute', 'Cured', 'Chronic']

export const SERVICE_TYPES = ['ER Hospital', 'Clinic', 'School', 'Boarding', 'Groomer', 'Sitter', 'Pet Store', 'Other']

export const PET_DETAILS = {
  id: 'Identifications',
  service: 'Services',
  medication: 'Medications',
  allergy: 'Allergies',
  condition: 'Health Conditions',
}

export const getDetailHeader = (key: string) => {
  return PET_DETAILS[key]
}

export const ALLERGIES = [
  { icon: 'Food', title: ['beef', 'pork', 'chicken', 'turkey', 'lamb', 'egg', 'corn', 'wheat', 'dairy'] },
  { icon: 'Environmental', title: ['pollen', 'grass', 'mold', 'mildew', 'dust mites'] },
  { icon: 'Flea/ Insect', title: ['spiders', 'ticks', 'fleas', 'blackflies', 'deerflies', 'horseflies', 'mosquitoes', 'ants', 'bees', 'hornets', 'wasps'] },
  { icon: 'Contact', title: ['flea collar', 'wool', 'pesticides', 'grass', 'synthetics', 'shampoo'] },
  { icon: 'Drug', title: ['antibiotic', 'anticonvulsant', 'antihypertensive', 'NSAID', 'antiarrhythmic', 'vaccine'] },
  { icon: 'Asthma', title: ['cigarette', 'litter dust', 'hair spray', 'mold', 'pollen', 'powder', 'household chemicals', 'air freshener'] },
]

export const ALLERGY_SYMPTOMS = ['skin irritation', 'generalized itching', 'hives', 'respiratory distress', 'vomiting', 'diarrhea', 'swelling', 'sneezing', 'itchy ears', 'chronic ear infections', 'itchy, runny eyes', 'constant licking', 'anaphylactic shock', 'itchy paws']