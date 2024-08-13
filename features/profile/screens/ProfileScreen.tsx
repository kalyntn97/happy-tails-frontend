//npm modules
import { Suspense, useEffect, useState } from "react"
import { View, Text, Button, StyleSheet, FlatList, Image, TouchableOpacity, ImageStyle, Touchable, Pressable, ScrollView } from "react-native"
import { useQueryClient } from "@tanstack/react-query"
//store & queries
import { profileKeyFactory, useAddBanner, useGetProfile } from "@profile/profileQueries"
//types
import { Profile, ProfileData } from "@profile/ProfileInterface"
import { Pet, PetBasic } from "@pet/PetInterface"
//components
import PetList from "@components/PetInfo/PetList"
import Loader from "@components/Loader"
import { TitleLabel, BoxWithHeader, ErrorImage } from "@components/UIComponents"
//hooks & utils
import { AlertForm, getActionIconSource } from "@utils/ui"
import { useCaresByFrequency, useSelectPhoto, useTaskCounts } from "@hooks/sharedHooks"
//styles
import { Buttons, Spacing, UI, Typography, Colors } from '@styles/index'

const ProfileScreen = ({ navigation, route }) => {
  const { data, isFetching, isError } = useGetProfile()
  const profile = data.profile

  const [banner, setBanner] = useState<string>(profile.banner ?? null)
  // const { careCounts, healthCounts } = useTaskCounts()
  // const careCounter = careCounts(new Date())
  // const healthCounter = healthCounts()
  const addBannerMutation = useAddBanner()
  //set a random profile photo if user does not have one
  const randomProfilePhotos = [
    require('@assets/icons/profile-1.png'),
    require('@assets/icons/profile-2.png'),
    require('@assets/icons/profile-3.png'),
    require('@assets/icons/profile-4.png'),
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

  if (isFetching) return <Loader />
  if (isError) return <ErrorImage />

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable style={styles.bannerCon} onPress={addBanner}>
        <View style={styles.cameraIcon}>
          <Image source={require('@assets/icons/action-camera.png')} style={{...UI.icon()}} />
        </View>
        { banner && <Image source={{ uri: banner }} style={styles.banner as ImageStyle} /> }
      </Pressable>

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
            
          {/* <View style={{...UI.rowContent()}}>
            <StatButton item={ {header: 'streak', stat: 0, body: 'days'}} />
            <StatButton item={ {header: 'tasks', stat: careCounts(new Date()) , body: 'today'}} />
            <StatButton item={ {header: 'visit due', stat: Math.abs(healthCounter), body: `days ${healthCounter < 0 && 'ago'}`}} color={healthCounter < 0 && Colors.red.reg} />
          </View> */}
        </View>

        <View style={styles.bodyCon}>
          <BoxWithHeader title='All Pets' iconName="home" onPress={() => navigation.navigate('Pets', { screen: 'Index' })}>
            <PetList petArray={data.pets} size='compact' />
          </BoxWithHeader>
          
          <View style={{...UI.roundedCon()}}>
            <TitleLabel title="All pet care tasks" iconName="care" onPress={() => navigation.navigate('Home', { screen: 'CareIndex' })} />
            <TitleLabel title="All vet visits" iconName="health" onPress={() => navigation.navigate('Home', { screen: 'HealthIndex' })} />
            <TitleLabel title="Update profile" iconName="editSquare" onPress={() => navigation.navigate('Edit', { profile : profile })} />
            <TitleLabel title="Settings" iconName="settings" onPress={() => navigation.navigate('Settings', { profile : profile })} />
          </View>
        </View>
      </View>
    
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
    backgroundColor: Colors.pink.light,
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
    top: 150,
    left: 0,
    zIndex: 3,
    backgroundColor: Colors.transparent.light,
    padding: 8,
    width: 50,
    height: 50,
    borderTopRightRadius: 15,
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
    ...UI.photo('large', 99, 10),
    backgroundColor: Colors.pink.light,
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