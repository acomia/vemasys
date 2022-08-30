import React, {useEffect} from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import MainNavigator from './main-navigator'
import {GPSTracker} from '@bluecentury/components'
import {
  Login,
  Splash,
  QRScanner,
  Formations,
  CharterDetails,
  PDFView,
  NewBunkering,
  BunkeringDetails,
  PlanningDetails,
  PlanningNewComment,
  AddEditNavlogAction,
  TechnicalTasksList,
  TechnicalTaskDetails,
  TechnicalTaskNewComment,
  AddEditTechnicalTask,
  TechnicalCertificateDetails,
  TechnicalCertificateList,
  AddEditBulkCargo,
  AddEditComment,
  Measurements,
  TechnicalRoutinesList,
  TechnicalRoutineDetails,
  FinancialInvoiceDetails,
  TickerOilPriceDetails,
  AddCrewMember,
  Entity
} from '@bluecentury/screens'
import {Colors} from '@bluecentury/styles'
import {TrackingListener} from '@bluecentury/helpers/geolocation-tracking-helper'
import {useAuth, useEntity, useSettings} from '@bluecentury/stores'
// import BackgroundGeolocation from '@mauron85/react-native-background-geolocation'

const {Navigator, Screen, Group} =
  createNativeStackNavigator<RootStackParamList>()

export default function RootNavigator() {
  const isMobileTracking = useSettings(state => state.isMobileTracking)
  // useEffect(() => {
  //   if (isMobileTracking) {
  //     TrackingListener({
  //       token: useAuth.getState().token as string,
  //       selectedUserId: useEntity.getState().entityUserId as string
  //     })
  //   } else {
  //     BackgroundGeolocation.removeAllListeners()
  //   }
  // }, [isMobileTracking])
  return (
    <Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
        headerStyle: {backgroundColor: Colors.light},
        headerTitleStyle: {fontSize: 16, fontWeight: 'bold'},
        animation: 'fade'
      }}
    >
      <Group>
        <Screen name="Splash" component={Splash} />
        <Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false
          }}
        />
        <Screen
          name="SelectEntity"
          component={Entity}
          options={{
            title: 'Select your role',
            headerStyle: {backgroundColor: '#F0F0F0'}
          }}
        />
        <Screen
          name="Main"
          component={MainNavigator}
          options={{headerShown: false}}
        />
        <Screen
          name="QRScanner"
          component={QRScanner}
          options={{headerShown: false}}
        />
        <Screen
          name="Formations"
          component={Formations}
          options={{
            title: 'Active Formations',
            headerShown: true
          }}
        />
        <Screen
          name={'CharterDetails'}
          component={CharterDetails}
          options={{headerShown: true, title: 'Charter Information'}}
        />
        <Screen
          name={'PDFView'}
          component={PDFView}
          options={{headerShown: true, title: 'PDF Viewer'}}
        />
        <Screen
          name={'NewBunkering'}
          component={NewBunkering}
          options={{headerShown: true, title: 'Add bunkering'}}
        />
        <Screen
          name={'BunkeringDetails'}
          component={BunkeringDetails}
          options={{headerShown: true, title: 'Bunkering Details'}}
        />
        <Screen
          name={'PlanningDetails'}
          component={PlanningDetails}
          options={({route}) => ({
            headerShown: true,
            title: route.params.title
          })}
        />
        <Screen
          name={'PlanningNewComment'}
          component={PlanningNewComment}
          options={{headerShown: true, title: 'New Comment'}}
        />
        <Screen
          name={'AddEditNavlogAction'}
          component={AddEditNavlogAction}
          options={({route}) => ({
            headerShown: true,
            title: route.params.method === 'add' ? 'Add Action' : 'Edit Action'
          })}
        />
        <Screen
          name={'TechnicalTasksList'}
          component={TechnicalTasksList}
          options={({route}) => ({
            headerShown: true,
            title: route.params.title
          })}
        />
        <Screen
          name={'TechnicalTaskDetails'}
          component={TechnicalTaskDetails}
          options={{headerShown: true, title: 'Task Details'}}
        />
        <Screen
          name={'TechnicalTaskNewComment'}
          component={TechnicalTaskNewComment}
          options={{headerShown: true, title: 'New Comment'}}
        />
        <Screen
          name={'AddEditTechnicalTask'}
          component={AddEditTechnicalTask}
          options={({route}) => ({
            headerShown: true,
            title: route.params.method === 'add' ? 'Add a Task' : 'Edit Task'
          })}
        />

        <Screen
          name={'TechnicalCertificateList'}
          component={TechnicalCertificateList}
          options={({route}) => ({
            headerShown: true,
            title: route.params.title
          })}
        />
        <Screen
          name={'TechnicalCertificateDetails'}
          component={TechnicalCertificateDetails}
          options={{
            headerShown: true,
            title: 'Certificate Details'
          }}
        />
        <Screen
          name={'AddEditBulkCargo'}
          component={AddEditBulkCargo}
          options={({route}) => ({
            headerShown: true,
            title:
              route.params.method === 'edit'
                ? 'Edit Cargo Entry'
                : 'New Cargo Entry'
          })}
        />
        <Screen
          name={'AddEditComment'}
          component={AddEditComment}
          options={({route}) => ({
            headerShown: true,
            title:
              route.params.method === 'edit' ? 'Edit Comment' : 'New Comment'
          })}
        />
        <Screen
          name={'Measurements'}
          component={Measurements}
          options={{
            headerShown: true,
            title: 'Measurements'
          }}
        />
        <Screen
          name={'TechnicalRoutinesList'}
          component={TechnicalRoutinesList}
          options={({route}) => ({
            headerShown: true,
            title: route.params.title
          })}
        />
        <Screen
          name={'TechnicalRoutineDetails'}
          component={TechnicalRoutineDetails}
          options={({route}) => ({
            headerShown: true,
            title: route.params.title
          })}
        />
        <Screen
          name={'FinancialInvoiceDetails'}
          component={FinancialInvoiceDetails}
          options={({route}) => ({
            headerShown: true,
            title: route.params.title
          })}
        />
        <Screen
          name={'TickerOilPriceDetails'}
          component={TickerOilPriceDetails}
          options={{
            headerShown: true,
            title: 'Ticker oil price details'
          }}
        />
        <Screen
          name={'AddCrewMember'}
          component={AddCrewMember}
          options={{
            headerShown: true,
            title: 'Add crew member'
          }}
        />
      </Group>
      <Group>
        <Screen
          name="GPSTracker"
          component={GPSTracker}
          options={{
            presentation: 'transparentModal',
            animation: 'slide_from_bottom'
          }}
        />
      </Group>
    </Navigator>
  )
}
