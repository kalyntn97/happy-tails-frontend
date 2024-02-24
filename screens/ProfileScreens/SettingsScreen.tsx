//npm modules
import { useEffect, useState } from "react"
import { View, Text, Button, StyleSheet, FlatList, Image, TouchableOpacity, ImageStyle, Touchable, Pressable, ScrollView } from "react-native"
import { createDrawerNavigator } from "@react-navigation/drawer"
//context
import { useProfileContext } from "../../context/ProfileContext"
//types
import { usePetContext } from "../../context/PetContext"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../../styles'
import ScrollPetList from "../../components/ScrollPetList"

const SettingsScreen = ({ navigation, route }) => {
  const { profile } = useProfileContext()
  const { pets } = usePetContext()
  //set a random profile photo if user does not have one
  const randomProfilePhotos = [
    require('../../assets/icons/micon1.png'),
    require('../../assets/icons/micon2.png'),
    require('../../assets/icons/micon3.png'),
    require('../../assets/icons/ficon1.png'),
    require('../../assets/icons/ficon2.png'),
    require('../../assets/icons/ficon3.png'),
  ]

  const [randomProfile, setRandomProfile] = useState(randomProfilePhotos[0])
  const changeRandomProfilePhoto = () => {
    const randomIdx = Math.floor(Math.random() * randomProfilePhotos.length)
    setRandomProfile(randomProfilePhotos[randomIdx])
  }

  useEffect(() => {
    if (profile && !profile.photo) {
      const fetchProfilePhoto = async () => {
        changeRandomProfilePhoto()
      }
      fetchProfilePhoto()
    }
  }, [route.params?.profileId])

  return ( 
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.profileHeader}>
          {/* <Text style={styles.header}>{profile.name}</Text> */}
          <Image source={profile.photo ? { uri: profile.photo } : randomProfile} style={styles.profilePhoto }/>
        </View>
        
        <View style={styles.bioBox}>
          <Text style={styles.bioText}>{profile.bio}</Text>
        </View>

        <View style={styles.btnContainer}>
          <TouchableOpacity 
            style={[styles.mainBtn, { backgroundColor: Colors.yellow }]}
            onPress={() => navigation.navigate('Edit', { profile : profile })}
          >
            <Text style={styles.btnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.mainBtn, { backgroundColor: Colors.red }]}
            onPress={() => navigation.navigate('Config', { profile : profile })}
          >
            <Text style={styles.btnText}>Manage</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Pressable onLongPress={() => navigation.navigate('Profile')}>
        <ScrollPetList petArray={pets} size='compact' />
      </Pressable>

    </View>
  )
}
 
const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenDown,
  },
  headerContainer: {
    width: '100%',
    height: '50%',
    ...Spacing.flexColumn,
  },
  profileHeader: {
    width: '90%',
    height: '60%',
    ...Spacing.flexColumn,
  },
  header: {
    ...Typography.xSmallHeader,
    height: '15%',
    margin: 10
  },
  profilePhoto: {
    ...Forms.smallPhoto,
    backgroundColor: Colors.lightPink,
    margin: 10,
  },
  bioBox: {
    width: '90%',
    maxHeight: '20%',
    marginBottom: 10,
    ...Spacing.centered
  },
  bioText: {
    textAlign: 'left'
  },
  btnContainer: {
    width: '90%',
    height: '15%',
    ...Spacing.flexRow,
    justifyContent: 'center'
  },
  mainBtn : {
    ...Buttons.xSmallRounded,
  },
  btnText: {
    ...Buttons.buttonText
  },
  petList: {
    ...Spacing.flexRow,
    width: '90%',
    flexWrap: 'wrap',
  },
  petInfo: {
    width: '30%',
    height: 130
  },
  logoutBtn: {
    ...Buttons.longSquare,
    backgroundColor: Colors.darkPink,
    marginTop: 'auto',
    marginBottom: 20,
  }
})

export default SettingsScreen