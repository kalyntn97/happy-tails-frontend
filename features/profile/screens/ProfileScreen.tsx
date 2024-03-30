//npm modules
import { useEffect, useState } from "react"
import { View, Text, Button, StyleSheet, FlatList, Image, TouchableOpacity, ImageStyle, Touchable, Pressable, ScrollView } from "react-native"
//store & queries
import { useAddBanner, useGetProfile } from "@profile/profileQueries"
import { useShallowPetBasics } from "@store/storeUtils"
//types
import { PetBasic } from "@pet/PetInterface"
//components
import PetList from "@components/PetInfo/PetList"
import Loader from "@components/Loader"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'
import { useSelectPhoto } from "@home/hooks"
import { AlertForm } from "@utils/ui"
import { BoxHeader, BoxStyles, BoxWithHeader } from "@components/HeaderComponent"

const ProfileScreen = ({ navigation, route }) => {
  const { data: profile, isLoading, isError } = useGetProfile()
  const [banner, setBanner] = useState<string>(profile.banner ?? null)
  const pets: PetBasic[] = useShallowPetBasics()
  const addBannerMutation = useAddBanner()
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

  const addBanner = async () => {
    const photoUri = await useSelectPhoto()
    const photoData = photoUri ? { uri: photoUri, name: `${profile._id}_banner`, type: 'image/jpeg' } : null
    if (photoData) {
      addBannerMutation.mutate(photoData , {
        onSuccess: (data) => {
          setBanner(data)
          return AlertForm({ body: 'Profile updated successfully', button: 'OK' })
        },
        onError: (error) => {
          return AlertForm({ body: `Error: ${error}`, button: 'Retry' })
        }
      })
    }
  }

  return ( 
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable style={styles.bannerCon} onPress={addBanner}>
        <Image source={require('@assets/icons/camera.png')} style={styles.cameraIcon} />
        { banner && <Image source={{ uri: banner }} style={[
            styles.banner,
            
          ] as ImageStyle} /> }
      </Pressable>
      { profile &&
        <View style={styles.profileCon}>
          <View style={styles.headerContainer}>
            <View style={styles.profileHeader}>
              <Image source={{ uri: profile.photo ?? randomProfilePhotos[randomIdx] }} style={styles.profilePhoto }/>
              <Text style={styles.header}>{profile.name}</Text>
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
                onPress={() => navigation.navigate('Settings', { profile : profile })}
              >
                <Text style={styles.btnText}>Manage</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bodyCon}>
            <BoxWithHeader title='All Pets' onPress={() => navigation.navigate('Pets', { screen: 'Index' })} content={
              pets ?
                <>
                  <PetList petArray={pets} size='compact' />
                  { !pets.length && <Loader /> }
                </>
              :
                <Text>Error fetching pets...</Text> 
              
            } />
            <View style={{...BoxStyles}}>
              <BoxHeader title="Manage all care tasks" onPress={() => navigation.navigate('Care', { screen: 'Index', initial: false})} />
              <BoxHeader title="Manage all vet visits" onPress={() => navigation.navigate('Health', { screen: 'Index', initial: false})} />
            </View>
            
          </View>
        </View>
      }
      { isLoading && <Loader /> }
      { isError && <Text>Error fetching profile</Text> }

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
  },
  bannerCon: {
    width: '100%',
    height: 200,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: Colors.lightPink,
    overflow: 'hidden',
  },
  banner: {
    maxWidth: '100%',
    height: '60%',
    overflow: 'visible',
    zIndex: 2,
  },
  cameraIcon: {
    ...Forms.smallIcon,
    position: "absolute",
    top: 160,
    left: 10,
    zIndex: 3,
  },
  profileCon: {
    width: '100%',
    marginTop: 120,
    ...Spacing.flexColumn,
  },
  headerContainer: {
    width: '100%',
    ...Spacing.flexColumn,
  },
  profileHeader: {
    width: '90%',
    ...Spacing.flexColumn,
  },
  bodyCon: {
    ...Spacing.flexColumn,
    paddingVertical: 30,
  },
  header: {
    ...Typography.xSmallHeader,
    marginTop: 0,
    marginBottom: 10,
    borderTopRightRadius: 15,
  },
  profilePhoto: {
    ...Forms.smallPhoto,
    backgroundColor: Colors.lightPink,
    margin: 10,
  },
  bioBox: {
    width: '90%',
    margin: 30,
    ...Spacing.centered
  },
  bioText: {
    textAlign: 'left'
  },
  btnContainer: {
    width: '90%',
    ...Spacing.flexRow,
    justifyContent: 'center',
  },
  mainBtn : {
    ...Buttons.xSmallRounded,
  },
  btnText: {
    ...Buttons.buttonText
  },
  logoutBtn: {
    ...Buttons.longSquare,
    backgroundColor: Colors.darkPink,
    marginTop: 'auto',
    marginBottom: 20,
  },
  linkBtn: {
    width: '100%'
  }
})

export default ProfileScreen