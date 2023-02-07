import React from 'react'
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
  Entity,
  InformationPegelDetails,
  SelectEnvironment,
  ImgViewer,
  CharterAcceptSign,
  TrackingServiceDialog,
  SignUp,
  SignUpVerification,
} from '@bluecentury/screens'
import {Colors} from '@bluecentury/styles'
import {useTranslation} from 'react-i18next'

const {Navigator, Screen, Group} =
  createNativeStackNavigator<RootStackParamList>()

export default function RootNavigator() {
  const {t} = useTranslation()
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
        headerStyle: {backgroundColor: Colors.light},
        headerTitleStyle: {fontSize: 16, fontWeight: 'bold'},
        animation: 'fade',
        headerBackTitleVisible: false,
      }}
      initialRouteName="Splash"
    >
      <Group>
        <Screen component={Splash} name="Splash" />
        <Screen
          options={{
            headerShown: false,
          }}
          component={Login}
          name="Login"
        />
        <Screen
          options={{
            headerShown: false,
          }}
          component={SelectEnvironment}
          name="SelectEnvironment"
        />
        <Screen
          options={{
            title: t('selectYourRole'),
            headerStyle: {backgroundColor: '#F0F0F0'},
          }}
          component={Entity}
          name="SelectEntity"
        />
        <Screen
          component={MainNavigator}
          name="Main"
          options={{headerShown: false}}
        />
        <Screen
          component={QRScanner}
          name="QRScanner"
          options={{headerShown: false}}
        />
        <Screen
          options={{
            title: t('activeFormations'),
            headerShown: true,
          }}
          component={Formations}
          name="Formations"
        />
        <Screen
          component={CharterDetails}
          name={'CharterDetails'}
          options={{headerShown: true, title: t('charterInformation')}}
        />
        <Screen
          component={PDFView}
          name={'PDFView'}
          options={{headerShown: true, title: t('PDFViewer')}}
        />
        <Screen
          component={NewBunkering}
          name={'NewBunkering'}
          options={{headerShown: true, title: t('addBunkering')}}
        />
        <Screen
          component={BunkeringDetails}
          name={'BunkeringDetails'}
          options={{headerShown: true, title: t('bunkeringDetails')}}
        />
        <Screen
          options={({route}) => ({
            headerShown: true,
            title: route.params.title,
          })}
          component={PlanningDetails}
          name={'PlanningDetails'}
        />
        <Screen
          component={PlanningNewComment}
          name={'PlanningNewComment'}
          options={{headerShown: true, title: t('planning')}}
        />
        <Screen
          options={({route}) => ({
            headerShown: true,
            title:
              route.params.method === 'edit'
                ? `Edit ${route.params.actionType}`
                : route.params.actionType === 'Cleaning'
                ? route.params.actionType
                : `New ${route.params.actionType}`,
          })}
          component={AddEditNavlogAction}
          name={'AddEditNavlogAction'}
        />
        <Screen
          options={({route}) => ({
            headerShown: true,
            title: t(route.params.title),
          })}
          component={TechnicalTasksList}
          name={'TechnicalTasksList'}
        />
        <Screen
          component={TechnicalTaskDetails}
          name={'TechnicalTaskDetails'}
          options={{headerShown: true, title: t('taskDetails')}}
        />
        <Screen
          component={TechnicalTaskNewComment}
          name={'TechnicalTaskNewComment'}
          options={{headerShown: true, title: t('newComment')}}
        />
        <Screen
          options={({route}) => ({
            headerShown: true,
            title:
              route.params.method === 'add' ? t('addATask') : t('editTask'),
          })}
          component={AddEditTechnicalTask}
          name={'AddEditTechnicalTask'}
        />

        <Screen
          options={({route}) => ({
            headerShown: true,
            title: route.params.title,
          })}
          component={TechnicalCertificateList}
          name={'TechnicalCertificateList'}
        />
        <Screen
          options={{
            headerShown: true,
            title: t('certificateDetails'),
          }}
          component={TechnicalCertificateDetails}
          name={'TechnicalCertificateDetails'}
        />
        <Screen
          options={({route}) => ({
            headerShown: true,
            title:
              route.params.method === 'edit'
                ? t('updateCargoAmount')
                : t('newCargoEntry'),
          })}
          component={AddEditBulkCargo}
          name={'AddEditBulkCargo'}
        />
        <Screen
          options={({route}) => ({
            headerShown: true,
            title:
              route.params.method === 'edit'
                ? t('editComment')
                : t('newComment'),
          })}
          component={AddEditComment}
          name={'AddEditComment'}
        />
        <Screen
          options={{
            headerShown: true,
            title: t('measurements'),
          }}
          component={Measurements}
          name={'Measurements'}
        />
        <Screen
          options={({route}) => ({
            headerShown: true,
            title: route.params.title,
          })}
          component={TechnicalRoutinesList}
          name={'TechnicalRoutinesList'}
        />
        <Screen
          options={({route}) => ({
            headerShown: true,
            title: t(route.params.title),
          })}
          component={TechnicalRoutineDetails}
          name={'TechnicalRoutineDetails'}
        />
        <Screen
          options={({route}) => ({
            headerShown: true,
            title: route.params.title,
          })}
          component={FinancialInvoiceDetails}
          name={'FinancialInvoiceDetails'}
        />
        <Screen
          options={{
            headerShown: true,
            title: t('tickerOilPriceDetails'),
          }}
          component={TickerOilPriceDetails}
          name={'TickerOilPriceDetails'}
        />
        <Screen
          options={{
            headerShown: true,
            title: t('addCrewMember'),
          }}
          component={AddCrewMember}
          name={'AddCrewMember'}
        />
        <Screen
          options={{
            headerShown: true,
            title: t('pegelDetails'),
          }}
          component={InformationPegelDetails}
          name={'InformationPegelDetails'}
        />
        <Screen
          options={({route}) => ({
            headerShown: true,
            title: route.params.title,
          })}
          component={ImgViewer}
          name={'ImgViewer'}
        />
        <Screen
          options={{
            headerShown: true,
            title: t('signature'),
          }}
          component={CharterAcceptSign}
          name={'CharterAcceptSign'}
        />
        <Screen
          options={{
            headerShown: true,
            title: t('signUp'),
          }}
          component={SignUp}
          name={'SignUp'}
        />
        <Screen
          options={{
            headerShown: true,
            title: 'Verification',
            headerStyle: {backgroundColor: Colors.white},
          }}
          component={SignUpVerification}
          name={'SignUpVerification'}
        />
      </Group>
      <Group
        screenOptions={{
          presentation: 'containedTransparentModal',
          animation: 'slide_from_bottom',
        }}
      >
        <Screen
          component={TrackingServiceDialog}
          name="TrackingServiceDialog"
        />
        <Screen component={GPSTracker} name="GPSTracker" />
      </Group>
    </Navigator>
  )
}
