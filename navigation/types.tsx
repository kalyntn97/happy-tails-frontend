//types
import { Care } from "@care/CareInterface";
import { Health } from "@health/HealthInterface";
import { DetailType, Pet } from "@pet/PetInterface";
import { Profile } from "@profile/ProfileInterface";
//props
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Stat } from "@stat/statInterface";

type DefaultParamList = {
  [key: string]: undefined;
}

export type HomeTabParamList = DefaultParamList

export type RootStackParamList = DefaultParamList & {
  CareEdit: { care: Care },
  CareDetails: { care: Care },
  HealthEdit: { health: Health },
  HealthDetails: { health: Health },
  PetEdit: { pet: Pet },
  PetDetails: { petId: string },
  PetMoreDetails: { petId: string, show: string },
  PetEditDetails: { petId: string, type: DetailType },
  CreateStat: { pet: { _id: string, name: string } },
  StatDetails: { stat: string },
  ProfileEdit: { profile: Profile },
}

export type StackScreenNavigationProp<T extends keyof RootStackParamList = keyof RootStackParamList> = NativeStackNavigationProp<RootStackParamList, T>

export type TabScreenNavigationProp<T extends Extract<keyof HomeTabParamList, string>> = CompositeNavigationProp<
  BottomTabNavigationProp<HomeTabParamList, T>,
  NativeStackNavigationProp<RootStackParamList, 'Home'>
>