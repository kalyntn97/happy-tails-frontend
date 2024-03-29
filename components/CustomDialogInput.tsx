//npm
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import { FC, useState } from 'react'
//styles
import { Buttons, Spacing, Forms, Colors } from '@styles/index'

interface CustomDialogInputProps {
  isOpen: boolean
}

const CustomDialogInput: FC<CustomDialogInputProps> = ({ isOpen }) => {
  const [modalVisible, setModalVisible] = useState(isOpen)

  
  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      onRequestClose={() => setModalVisible(!modalVisible)}
      transparent={true}
    >
      <Pressable onPress={(e) => e.target === e.currentTarget && setModalVisible(false)} style={styles.modalContainer}>
        <View style={styles.detailContainer}>
          <Text>This is a modal</Text>


        </View>
      </Pressable>

    </Modal>
    
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    ...Forms.modal,
  },
  detailContainer: {
    width: '100%',
    height: '60%',
    position: 'absolute',
    alignItems: 'center',
    bottom: 0,
  },

})

export default CustomDialogInput