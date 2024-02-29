//npm modules
import { useEffect, useState } from "react"
import { View, Text, Button, StyleSheet, FlatList, Image, TouchableOpacity, ImageStyle, Touchable, Pressable, ScrollView } from "react-native"
//store & queries
import { useGetProfile } from "@profile/profileQueries"
import { useShallowPetBasics } from "@store/storeUtils"
//types
import { PetBasic } from "@pet/PetInterface"
//components
import ScrollPetList from "@components/PetInfo/ScrollPetList"
import Loader from "@components/Loader"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'

const ProfileScreen = ({ navigation, route }) => {
  const { data: profile, isLoading: profileIsLoading, isError: profileError } = useGetProfile()
  // const { data: pets, isLoading: petsIsLoading, isError: petsError } = useGetAllPets()
  const pets: PetBasic[] = useShallowPetBasics()
  //set a random profile photo if user does not have one
  const randomProfilePhotos = [
    require('@assets/icons/micon1.png'),
    require('@assets/icons/micon2.png'),
    require('@assets/icons/micon3.png'),
    require('@assets/icons/ficon1.png'),
    require('@assets/icons/ficon2.png'),
    require('@assets/icons/ficon3.png'),
  ]
  const randomIdx = Math.floor(Math.random() * randomProfilePhotos.length)

  return ( 
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        { profile &&
          <>
              <View style={styles.profileHeader}>
                <Text style={styles.header}>{profile.name}</Text>
                <Image source={{ uri: profile.photo ?? randomProfilePhotos[randomIdx] }} style={styles.profilePhoto }/>
              </View>
              
              <View style={styles.bioBox}>
                <Text style={styles.bioText}>{profile.bio}</Text>
              </View>
          </> }
        { profileIsLoading && <Loader /> }
        { profileError && <Text>Error fetching profile</Text> }
        
        <View style={styles.btnContainer}>
          <TouchableOpacity 
            style={[styles.mainBtn, { backgroundColor: Colors.yellow }]}
            onPress={() => navigation.navigate('Edit', { profile : profile })}
          >
            <Text style={styles.btnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.mainBtn, { backgroundColor: Colors.red }]}
            onPress={() => navigation.navigate('Settings', { profile : profile })}
          >
            <Text style={styles.btnText}>Manage</Text>
          </TouchableOpacity>
        </View>
      </View>

      {pets &&
        <View>
          <ScrollPetList petArray={pets} size='compact' navigation={navigation} />
        </View>
      }
      { pets && !pets.length && <Loader /> }
      { !pets && <Text>Error fetching pets...</Text> }

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

export default ProfileScreen