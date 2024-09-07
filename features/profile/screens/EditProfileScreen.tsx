//npm modules
import { useEffect } from "react"
import { View } from "react-native"
//types & store & queries
import useForm from "@hooks/useForm"
import { Profile } from "@profile/ProfileInterface"
import { useUpdateProfile } from "@profile/profileQueries"
//components
import Loader from "@components/Loader"
import { FormInput, FormLabel, getHeaderActions, PhotoUpload, ScrollScreen } from "@components/UIComponents"
import { Header } from "@navigation/NavigationStyles"
import { AlertForm } from "@utils/ui"
//styles
import { styles } from "@styles/stylesheets/FormStyles"
import { TabScreenNavigationProp } from "@navigation/types"

interface EditProfileProps {
  navigation: TabScreenNavigationProp<'Profile'>
  route: {params: { profile: Profile }}
}

const EditProfileScreen = ({ navigation, route }: EditProfileProps) => {
  const { profile } = route.params
  
  const initialState = {
    name: profile.name,
    bio: profile.bio ?? null,
    photo: profile.photo ?? null,
    errors: {},
  }
  
  const { values, onChange, onValidate, onReset } = useForm(handleSubmit, initialState)
  const { name, bio, photo, errors } = values

  const updateProfileMutation = useUpdateProfile(navigation)
  
  function handleValidate() {
    onValidate({ name })
  }
  
  async function handleSubmit(name: string, bio: string, photo: string) {
    const photoData = photo ? { uri: photo, name: name, type: 'image/jpeg' } : null
    
    updateProfileMutation.mutate({ name, bio, photoData })
  }

  const headerActions = getHeaderActions(onReset, updateProfileMutation.isPending, handleValidate)

  useEffect(() => {
    navigation.setOptions({
      header: () => <Header showGoBackButton={true} rightActions={headerActions} navigation={navigation} mode='modal' />
    })
  }, [headerActions])
  
  return ( 
    <ScrollScreen>
      {profile ? 
        <>
          <View style={styles.headerCon}>
            <PhotoUpload photo={photo} onSelect={(uri: string) => onChange('photo', uri)} />
            <View style={styles.titleCon}>
              <FormInput initial={name} placeholder="Your name" onChange={(text: string) => onChange('name', text)} styles={styles.title} maxLength={50} props={{ autoCapitalize: 'words', multiline: true, selectTextOnFocus: true }} error={errors?.name} withBorder={false} />
            </View>
          </View>

          <FormLabel label="More Info" icon="tag"/>
          <FormInput initial={bio} placeholder="Enter bio" onChange={(text: string) => onChange('bio', text)} maxLength={200} props={{ multiline: true, selectTextOnFocus: true }} error={errors?.bio} styles={{ height: 120 }} width='90%' />
        </>
        : <Loader />
      }
    </ScrollScreen>
  )
}

export default EditProfileScreen