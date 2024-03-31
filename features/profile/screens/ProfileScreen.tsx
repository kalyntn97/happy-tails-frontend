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
import { StatButton } from "@components/ButtonComponent"

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
        <View style={styles.cameraIcon}>
          <Image source={require('@assets/icons/camera.png')} style={{...Forms.smallIcon}} />
        </View>
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
              <Text style={styles.subHeader}>@{profile.username}</Text>
            </View>
            
            <View style={styles.bioBox}>
              <Text style={styles.bioText}>{profile.bio}</Text>
            </View>
              
            <View style={{...Forms.rowCon}}>
              <StatButton item={ {header: 'streak', stat: 7, body: 'days'}} />
              <StatButton item={ {header: 'tasks', stat: 1, body: 'today'}} />
              <StatButton item={ {header: '♥︎', stat: pets.length, body: 'pets'}} />
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
            <View style={{...Forms.roundedCon}}>
              <BoxHeader title="All pet care tasks" onPress={() => navigation.navigate('Care', { screen: 'Index', initial: false})} />
              <BoxHeader title="All vet visits" onPress={() => navigation.navigate('Health', { screen: 'Index', initial: false})} />
              <BoxHeader title="Update profile" onPress={() => navigation.navigate('Edit', { profile : profile })} />
              <BoxHeader title="Settings" onPress={() => navigation.navigate('Settings', { profile : profile })} />
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
    opacity: 0.8,
  },
  cameraIcon: {
    position: "absolute",
    top: 145,
    left: 10,
    zIndex: 3,
    backgroundColor: Colors.lightPink,
    borderRadius: 99,
    padding: 5,
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
    marginVertical: 15,
  },
  header: {
    ...Typography.xSmallHeader,
    marginTop: 10,
    marginBottom: 0,
    borderTopRightRadius: 15,
  },
  subHeader: {
    ...Typography.xSmallSubHeader,
    color: 'gray',
    marginTop: 0,
    marginBottom: 10,
  },
  profilePhoto: {
    ...Forms.smallPhoto,
    backgroundColor: Colors.lightPink,
    margin: 10,
  },
  bioBox: {
    width: '90%',
    margin: 10,
    ...Spacing.centered,
  },
  bioText: {
    textAlign: 'left',
    ...Typography.xSmallBody,
    lineHeight: 20,
  },
  statsCon: {
    width: '90%',
    ...Spacing.flexRow,
    justifyContent: 'center',
  },
  linkBtn: {
    width: '100%'
  }
})

export default ProfileScreen