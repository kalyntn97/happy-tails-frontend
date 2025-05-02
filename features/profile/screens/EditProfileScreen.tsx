//npm modules
import React from 'react'
//types & store & queries
import { Profile, ProfileFormData } from "@profile/ProfileInterface"
import { TabScreenNavigationProp } from "@navigation/types"
import { PhotoFormData } from '@pet/PetInterface'
import { useUpdateProfile } from "@profile/profileQueries"
//components
import Loader from "@components/Loader"
import { ScrollScreen } from "@components/UIComponents"
import ProfileForm from '@profile/components/ProfileForm'
//styles

interface EditProfileProps {
  navigation: TabScreenNavigationProp<'Profile'>
  route: {params: { profile: Profile }}
}

const EditProfileScreen = ({ navigation, route }: EditProfileProps) => {
  const { profile } = route.params
  const updateProfileMutation = useUpdateProfile(navigation)
  
  const initialValues: ProfileFormData = {
    name: profile.name,
    bio: profile.bio,
    photo: profile.photo,
  }

  async function handleUpdateProfile(formData: ProfileFormData, photoData: PhotoFormData) {
    updateProfileMutation.mutate({ formData, photoData })
  }
  
  return ( 
    <ScrollScreen>
      {profile ? 
        <ProfileForm onSubmit={handleUpdateProfile} initialValues={initialValues} isPending={updateProfileMutation.isPending} navigation={navigation} />   
        : <Loader />
      }
    </ScrollScreen>
  )
}

export default EditProfileScreen