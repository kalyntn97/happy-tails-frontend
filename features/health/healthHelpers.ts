//constants
export const HEALTHS = [
  { icon: 'vax', title: 'Vaccine' },
  { icon: 'physical', title: 'Physical Exam' },
  { icon: 'dental', title: 'Dental Cleaning' },
  { icon: 'skin', title: 'Skin Exam' },
  { icon: 'xray', title: 'X-ray Exam' },
  { icon: 'ultra', title: 'Ultrasound' },
  { icon: 'blood', title: 'Blood Testing' },
  { icon: 'urine', title: 'Urinalysis' },
  { icon: 'fecal', title: 'Fecal Exam'},
  { icon: 'iv', title: 'IV drip' },
]

export const HEALTH_NAMES = Object.keys(HEALTHS).map(key => HEALTHS[key])

export const HEALTH_FREQ = ['day(s)', 'week(s)', 'month(s)', 'year(s)']

export const HEALTH_TYPES = ['Routine', 'Sick', 'Emergency']

const DOG_VACCINES: Record<string, { name: string, info: string }> = {
  da2pp: {
    name: 'Canine distemper, adenovirus type 1 and type 2, parainfluenza, and parvovirus (DA2PP) vaccine',
    info: `DA2PP is a core vaccine, meaning it is essential for protecting your dog from highly contagious diseases. This vaccine’s acronym comes from the diseases it prevents: canine distemper (D), adenovirus type 1 and 2 (A2), parainfluenza (P), and parvovirus (P). Other names: DHPP, DAPP, DA2PP, and DAPPC.`,
    // abbr: 'DA2PP',
  },
  rabies: {
    name: 'Rabies vaccine',
    info: 'Rabies is a virus that causes an infection most commonly found in wild animals like skunks, foxes, and Racoons. The prognosis after catching rabies is not good for unvaccinated pets, for whom the infection is most often fatal. ',
    // abbr: 'Rabies',
  },
  bordetella: {
    name: 'Kennel Cough vaccine',
    info: 'The Bordetella vaccine is a noncore vaccine usually given to dogs that are frequently exposed to other dogs in boarding or social settings. Canine facilities, such as dog daycare centers, boarding kennels, shows, dog parks, and training classes often require dogs to have the vaccine. This is because Bordetella bronchiseptica is the most common bacterial agent responsible for kennel cough in dogs',
    // abbr: 'Bordetella',
  },
  leptospirosis: {
    name: 'Leptospirosis vaccine',
    info: 'Leptospirosis is a disease caused by leptospira bacteria. The bacteria is often found in soil and water, mainly in puddles, streams, lakes, and rivers. Dogs are at risk of getting infected during playtime and interactions with other animals, including domestic, farm, and wild animals.',
    // abbr: 'Leptospirosis',
  },
  lyme: {
    name: 'Lyme Disease vaccine',
    info: 'Vaccination for Lyme borreliosis should be considered for dogs that live within or travel to regions with emerging or endemic Lyme disease. Lyme disease is caused by infection with tick-transmitted borrelial pathogens. Although at least 21 species of borrelial pathogens can cause Lyme disease, in North America disease is due almost exclusively to Borrelia burgdorferi.',
    // abbr: 'Lyme',
  },
  influenza: {
    name: 'Canine Influenza vaccine',
    info: 'There are two strains of canine influenza virus, both of which are contagious upper respiratory viruses known to infect dogs. Dogs who play in social settings run a higher risk of exposure to this virus than dogs who stay home. We recommend that pet parents vaccinate for both strains of the canine influenza virus to reduce the chance of contracting the virus or severity of symptoms if your dog does come down with the virus',
    // abbr: 'Influenza',
  }
}

const CAT_VACCINES: Record<string, { name: string, info: string }> = {
  fvrcp: {
    name: 'Feline Viral Rhinotracheitis, Calicivirus, and Panleukopenia (FVRCP) Vaccine',
    info: `The FVRCP vaccine is an extremely effective way to protect your kitty against 3 highly contagious and life-threatening feline diseases, Feline Viral Rhinotracheitis (that's the FVR part of the vaccine name), Feline Calicivirus (represented by the C), and Feline Panleukopenia (the P at the end of the vaccine name).`,
    // abbr: 'FVRCP',
  },
  rabies: {
    name: 'Rabies vaccine',
    info: 'Rabies is a virus that causes an infection most commonly found in wild animals like skunks, foxes, and Racoons. The prognosis after catching rabies is not good for unvaccinated pets, for whom the infection is most often fatal. ',
    // abbr: 'Rabies',
  },
  felv: {
    name: 'Feline leukemia virus (FeLV) vaccine',
    info: 'Feline leukemia virus (FeLV) is a virus that infects only cats. It depresses the immune system and cats tend to remain infected for life. FeLV is an important cause of anemia in cats and can cause several types of cancers. It is usually recommended for cats that spend time outdoors.',
    // abbr: 'FeLV',
  },
  chlamydophila: {
    name: 'Feline Chlamydophila vaccine',
    info: 'Feline Chlamydophila is a virus that is regarded as a primary conjunctival pathogen and infection always involves the eye, resulting in conjunctivitis and occasionally also causing signs of rhinitis, with sneezing and nasal discharge.',
    // abbr: 'Chlamydophila',
  },
  bordetella: {
    name: 'Bordetella bronchiseptica vaccine',
    info: 'Bordetella bronchiseptica is a bacteria that causes upper respiratory infections that are highly contagious. This vaccine may be recommended by your vet if you are taking your cat to a groomer or boarding kennel.',
    // abbr: 'Bordetella',
  },
  fip: {
    name: 'Feline infectious peritonitis (FIP) vaccine',
    info: 'Feline infectious peritonitis (FIP) is a viral disease of cats caused by certain strains of a virus called the feline coronavirus. Most strains of feline coronavirus are found in the gastrointestinal tract and do not cause significant disease. Once a cat develops clinical FIP, the disease is usually progressive and almost always fatal without therapy that has recently become available, but that has yet to be approved to treat FIP in cats by the Food and Drug Administration (FDA).The vaccine is not routinely recommended by the American Association of Feline Practitioners Feline Vaccine Advisory Panel.',
    // abbr: 'FIP',
  }
}

export const VACCINES = { ...CAT_VACCINES, ...DOG_VACCINES }

export const CAT_VACCINE_NAMES = Object.keys(CAT_VACCINES).map(key => CAT_VACCINES[key].name)

export const DOG_VACCINE_NAMES = Object.keys(DOG_VACCINES).map(key => DOG_VACCINES[key].name)

export const CAT_VACCINATION_LINK='https://catvets.com/guidelines/practice-guidelines/aafp-aaha-feline-vaccination'

export const DOG_VACCINATION_LINK='https://www.akc.org/expert-advice/health/vaccinations-for-your-dog-the-upshot'

//helpers
const nameToKey = (data: Record<string, { name: string, info: string }>) => {
  const map = {}
  for (const key in data) {
      const name = data[key].name
      map[name] = key
  }
  return map
}

const keyFromName = (data: { [key: string]: string }) => {
  let map = {}
  for (const key in data) {
    const name = data[key]
    map[name] = key
  }
  return map
}

export const healthKeyFromName = keyFromName(HEALTHS)

export const vaccineKeyFromName = nameToKey(VACCINES)

