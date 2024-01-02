//npm modules
import { useEffect, useState } from "react"
import { View, Text, Button, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native"
//context
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

const SettingsScreen = () => {
  const { onLogout } = useAuth()
  const [profile, setProfile] = useState<Profile>({})

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await profileService.show()
      setProfile(data)
      console.log(profile.pets)
    }
    fetchProfile()
  }, [])

  const logout = async () => {
    const result = await onLogout!()
    if (result && result.error) {
      alert(result.status)
    }
  }

  return ( 
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.profileHeader}>
          <Text style={styles.header}>{profile.name}</Text>
          <Image source={{ uri: profile.photo }} style={styles.profilePhoto}/>
        </View>
        
        <Text>{profile.bio}</Text>

        <View style={styles.btnContainer}>
          <TouchableOpacity style={styles.mainBtn} >
            <Text style={styles.btnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mainBtn} >
            <Text style={styles.btnText}>Delete</Text>
          </TouchableOpacity>
        </View>

      </View>
      <View style={styles.petList}>
        {profile.pets?.map((pet, idx) =>
          <View style={styles.petInfo}>
            <PetInfo key={idx} pet={pet} size='compact' />
          </View>
        )}
      </View>
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.btnText}>Logout</Text>
      </TouchableOpacity>
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
    height: '40%',
    ...Spacing.flexColumn
  },
  profileHeader: {
    width: '90%',
    height: '70%',
    ...Spacing.flexColumn
  },
  header: {
    ...Typography.smallHeader
  },
  profilePhoto: {
    ...Forms.smallPhoto,
    backgroundColor: Colors.lightPink
  },
  btnContainer: {
    width: '90%',
    height: '20%',
    ...Spacing.flexRow
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
    height: '30%',
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
    marginBottom: 20
  }
})

export default SettingsScreen