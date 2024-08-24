import { Image, Text, View } from "react-native"
//types & helpers
import { Care } from "@care/CareInterface"
import { getCareIcon } from "@care/careHelpers"
//components
import PetList from "@components/PetInfo/PetList"
//utils
import { getRepeatLabels } from "@components/Pickers/FrequencyPicker"
//styles
import { Colors } from "@styles/index"
import { styles } from "@styles/stylesheets/ModalCardStyles"
import ProgressTracker from "./ProgressTracker"

const CareCard = ({ care }: { care: Care }) => {
  const iconSource = getCareIcon(care.name)
  const { repeatLabel } = getRepeatLabels({ ...care.frequency, ending: !!care.endDate, endDate: care.endDate })

  return (
    <View style={[styles.container, { backgroundColor: Colors.multi.lightest[care.color] }]}>
      <View style={styles.header}>
        <Image source={iconSource} style={styles.icon} />
        <Text style={styles.title}>{care.name}</Text>
      </View>

      <View style={styles.rowCon}>
        <Text style={styles.frequency}>{repeatLabel}</Text>
        <PetList petArray={care.pets} size='xSmall' />
      </View>

      <ProgressTracker care={care} />
    </View>
  )
}

export default CareCard