//npm modules
import { useEffect, useState } from "react"
import { View, Text, Button, StyleSheet, FlatList, Image, TouchableOpacity, ImageStyle, Touchable, Pressable } from "react-native"
import { createDrawerNavigator } from "@react-navigation/drawer"
//context
import { useProfileContext } from "../context/ProfileContext"
import { useAuth } from "../context/AuthContext"
//services
import * as profileService from '../services/profileService'
import * as tokenService from '../services/tokenService'
//types
import { Profile } from "../services/profileService"
//components
import PetInfo from "../components/PetInfo"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

const SettingsScreen = ({ navigation }) => {
  const { profile } = useProfileContext()

  //set a random profile photo if user does not have one
  const randomProfilePhotos = [
    require('../assets/icons/micon1.png'),
    require('../assets/icons/micon2.png'),
    require('../assets/icons/micon3.png'),
    require('../assets/icons/ficon1.png'),
    require('../assets/icons/ficon2.png'),
    require('../assets/icons/ficon3.png'),
  ]

  const [randomProfile, setRandomProfile] = useState(randomProfilePhotos[0])
  const changeRandomProfilePhoto = () => {
    const randomIdx = Math.floor(Math.random() * randomProfilePhotos.length)
    setRandomProfile(randomProfilePhotos[randomIdx])
  }

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      changeRandomProfilePhoto()
    }
    fetchProfilePhoto()
  }, [])

  return ( 
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.profileHeader}>
          <Text style={styles.header}>{profile.name}</Text>
          <Image source={profile.photo ? { uri: profile.photo } : randomProfile} style={styles.profilePhoto as ImageStyle}/>
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
          <TouchableOpacity style={[styles.mainBtn, { backgroundColor: Colors.red }]} >
            <Text style={styles.btnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Pressable style={styles.petList} onLongPress={() => navigation.navigate('Profile')}>
        {profile.pets?.map((pet, idx) =>
          <View style={styles.petInfo} key={idx}>
            <PetInfo key={pet._id} pet={pet} size='compact' />
          </View>
        )}
      </Pressable>

    </View>
  )
}
 
const styles = StyleSheet.create({
  container: {
    ...Spacing.fullWH,
    ...Spacing.flexColumn,
    alignItems: 'center',
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
    ...Typography.smallHeader,
    height: '15%',
    margin: 10
  },
  profilePhoto: {
    ...Forms.smallPhoto,
    backgroundColor: Colors.lightPink,
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
    alignItems: 'center'
  },
  mainBtn : {
    ...Buttons.xSmallRounded
  },
  btnText: {
    ...Buttons.buttonText
  },
  petList: {
    ...Spacing.flexRow,
    width: '90%',
    height: '40%',
    flexWrap: 'wrap',
    marginTop: 'auto',
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