//npm modules
import { useState } from "react"
import { Image, ImageStyle, Pressable, StyleSheet, Text, View } from "react-native"
//store & queries
import { useAddBanner, useGetProfile } from "@profile/profileQueries"
//types
//components
import Loader from "@components/Loader"
import PetList from "@components/PetInfo/PetList"
import { ErrorImage, ScrollScreen, TitleLabel } from "@components/UIComponents"
//hooks & utils
import { useSelectPhoto } from "@hooks/sharedHooks"
import { AlertForm } from "@utils/ui"
//styles
import { TabScreenNavigationProp } from "@navigation/types"
import { Colors, Spacing, Typography, UI } from '@styles/index'

const randomProfilePhotos = [
  require('@assets/icons/profile-1.png'),
  require('@assets/icons/profile-2.png'),
  require('@assets/icons/profile-3.png'),
  require('@assets/icons/profile-4.png'),
]

type Props = {
  navigation: TabScreenNavigationProp<'Profile'>
}

const ProfileScreen = ({ navigation }: Props) => {
  const { data, isFetching, isError } = useGetProfile()
  const profile = data.profile

  const [banner, setBanner] = useState<string>(profile.banner ?? null)
  // const { careCounts, healthCounts } = useTaskCounts()
  // const careCounter = careCounts(new Date())
  // const healthCounter = healthCounts()
  const addBannerMutation = useAddBanner()
  //set a random profile photo if user does not have one
 
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
    <ScrollScreen contentStyles={{ position: 'relative' }}>
      <Pressable style={styles.bannerCon} onPress={addBanner}>
        <View style={styles.cameraIcon}>
          <Image source={require('@assets/icons/action-camera.png')} style={{...UI.icon()}} />
        </View>
        { banner && <Image source={{ uri: banner }} style={styles.banner as ImageStyle} /> }
      </Pressable>

      <View style={styles.profileCon}>
        <View style={Spacing.flexColumnStretch}>
          <View style={styles.profileHeader}>
            <Image source={ profile.photo ? { uri: profile.photo } : randomProfilePhotos[randomIdx] } style={styles.profilePhoto }/>
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

        <TitleLabel title='All pets' iconName='pet' mode='bold' containerStyles={{ paddingHorizontal: 10 }} />  
        <View style={[UI.card(), { width: '95%' }]}>
          { data.pets.length === 0 && <Text style={Typography.body}>No pets found</Text> }
          <PetList petArray={data.pets} size='small' />
        </View>

        <TitleLabel title='Actions' iconName='action' mode='bold' containerStyles={{ paddingHorizontal: 10 }} />  
        <View style={UI.card()}>
          <TitleLabel title="All pet care tasks" iconName="care" iconType='action' onPress={() => navigation.navigate('CareIndex')} />
          <TitleLabel title="All vet visits" iconName="health" onPress={() => navigation.navigate('HealthIndex')} />
          <TitleLabel title="Update profile" iconName="edit" onPress={() => navigation.navigate('ProfileEdit', { profile : profile })} />
          <TitleLabel title="Settings" iconName="settings" onPress={() => navigation.navigate('Settings', { profile : profile })} />
        </View>

      </View>
    
    </ScrollScreen>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    width: '100%',
    aspectRatio: 1,
    overflow: 'hidden',
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
    ...Spacing.flexColumnStretch,
    marginTop: 120,
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
    ...Typography.smallHeader,
    marginTop: 10,
    marginBottom: 0,
    borderTopRightRadius: 15,
  },
  subHeader: {
    ...Typography.smallSubHeader,
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
    ...Typography.smallBody,
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