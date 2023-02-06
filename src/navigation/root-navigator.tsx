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
} from '@bluecentury/screens'
import {Colors} from '@bluecentury/styles'
import {useTranslation} from 'react-i18next'

const {Navigator, Screen, Group} =
  createNativeStackNavigator<RootStackParamList>()

export default function RootNavigator() {
  const {t} = useTranslation()
  return (
    <Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
        headerStyle: {backgroundColor: Colors.light},
        headerTitleStyle: {fontSize: 16, fontWeight: 'bold'},
        animation: 'fade',
        headerBackTitle: t('back'),
      }}
    >
      <Group>
        <Screen name="Splash" component={Splash} />
        <Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        <Screen
          name="SelectEnvironment"
          component={SelectEnvironment}
          options={{
            headerShown: false,
          }}
        />
        <Screen
          name="SelectEntity"
          component={Entity}
          options={{
            title: t('selectYourRole'),
            headerStyle: {backgroundColor: '#F0F0F0'},
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
            title: t('activeFormations'),
            headerShown: true,
          }}
        />
        <Screen
          name={'CharterDetails'}
          component={CharterDetails}
          options={{headerShown: true, title: t('charterInformation')}}
        />
        <Screen
          name={'PDFView'}
          component={PDFView}
          options={{headerShown: true, title: t('PDFViewer')}}
        />
        <Screen
          name={'NewBunkering'}
          component={NewBunkering}
          options={{headerShown: true, title: t('addBunkering')}}
        />
        <Screen
          name={'BunkeringDetails'}
          component={BunkeringDetails}
          options={{headerShown: true, title: t('bunkeringDetails')}}
        />
        <Screen
          name={'PlanningDetails'}
          component={PlanningDetails}
          options={({route}) => ({
            headerShown: true,
            title: route.params.title,
          })}
        />
        <Screen
          name={'PlanningNewComment'}
          component={PlanningNewComment}
          options={{headerShown: true, title: t('planning')}}
        />
        <Screen
          name={'AddEditNavlogAction'}
          component={AddEditNavlogAction}
          options={({route}) => ({
            headerShown: true,
            title:
              route.params.method === 'edit'
                ? `Edit ${route.params.actionType}`
                : route.params.actionType === 'Cleaning'
                ? route.params.actionType
                : `New ${route.params.actionType}`,
          })}
        />
        <Screen
          name={'TechnicalTasksList'}
          component={TechnicalTasksList}
          options={({route}) => ({
            headerShown: true,
            title: t(route.params.title),
          })}
        />
        <Screen
          name={'TechnicalTaskDetails'}
          component={TechnicalTaskDetails}
          options={{headerShown: true, title: t('taskDetails')}}
        />
        <Screen
          name={'TechnicalTaskNewComment'}
          component={TechnicalTaskNewComment}
          options={{headerShown: true, title: t('newComment')}}
        />
        <Screen
          name={'AddEditTechnicalTask'}
          component={AddEditTechnicalTask}
          options={({route}) => ({
            headerShown: true,
            title: route.params.method === 'add' ? t('addATask') : t('editTask'),
          })}
        />

        <Screen
          name={'TechnicalCertificateList'}
          component={TechnicalCertificateList}
          options={({route}) => ({
            headerShown: true,
            title: route.params.title,
          })}
        />
        <Screen
          name={'TechnicalCertificateDetails'}
          component={TechnicalCertificateDetails}
          options={{
            headerShown: true,
            title: t('certificateDetails'),
          }}
        />
        <Screen
          name={'AddEditBulkCargo'}
          component={AddEditBulkCargo}
          options={({route}) => ({
            headerShown: true,
            title:
              route.params.method === 'edit'
                ? t('updateCargoAmount')
                : t('newCargoEntry'),
          })}
        />
        <Screen
          name={'AddEditComment'}
          component={AddEditComment}
          options={({route}) => ({
            headerShown: true,
            title:
              route.params.method === 'edit'
                ? t('editComment')
                : t('newComment'),
          })}
        />
        <Screen
          name={'Measurements'}
          component={Measurements}
          options={{
            headerShown: true,
            title: t('measurements'),
          }}
        />
        <Screen
          name={'TechnicalRoutinesList'}
          component={TechnicalRoutinesList}
          options={({route}) => ({
            headerShown: true,
            title: t(route.params.title),
          })}
        />
        <Screen
          name={'TechnicalRoutineDetails'}
          component={TechnicalRoutineDetails}
          options={({route}) => ({
            headerShown: true,
            title: route.params.title,
          })}
        />
        <Screen
          name={'FinancialInvoiceDetails'}
          component={FinancialInvoiceDetails}
          options={({route}) => ({
            headerShown: true,
            title: route.params.title,
          })}
        />
        <Screen
          name={'TickerOilPriceDetails'}
          component={TickerOilPriceDetails}
          options={{
            headerShown: true,
            title: t('tickerOilPriceDetails'),
          }}
        />
        <Screen
          name={'AddCrewMember'}
          component={AddCrewMember}
          options={{
            headerShown: true,
            title: t('addCrewMember'),
          }}
        />
        <Screen
          name={'InformationPegelDetails'}
          component={InformationPegelDetails}
          options={{
            headerShown: true,
            title: t('pegelDetails'),
          }}
        />
        <Screen
          name={'ImgViewer'}
          component={ImgViewer}
          options={({route}) => ({
            headerShown: true,
            title: route.params.title,
          })}
        />
        <Screen
          name={'CharterAcceptSign'}
          component={CharterAcceptSign}
          options={{
            headerShown: true,
            title: t('signature'),
          }}
        />
      </Group>
      <Group
        screenOptions={{
          presentation: 'containedTransparentModal',
          animation: 'slide_from_bottom',
        }}
      >
        <Screen
          name="TrackingServiceDialog"
          component={TrackingServiceDialog}
        />
        <Screen name="GPSTracker" component={GPSTracker} />
      </Group>
    </Navigator>
  )
}
