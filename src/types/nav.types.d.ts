import {Comments} from '@bluecentury/models'
type RootStackParamList = {
  Splash: undefined
  SelectEnvironment: undefined
  Login: undefined
  SelectEntity: undefined
  Main: undefined
  QRScanner: undefined
  Formations: undefined
  GPSTracker: undefined
  CharterDetails: {charter: {} | undefined}
  PDFView: {path: string | undefined}
  NewBunkering: undefined
  BunkeringDetails: {bunk: {} | undefined}
  PlanningDetails: {navlog: any; title?: string}
  AddEditBulkCargo: {cargo?: any; method?: string}
  PlanningNewComment: undefined
  AddEditComment: {comment?: Comments; method: string; routeFrom?: string}
  AddEditNavlogAction: {
    method: string
    actionType: string
    navlogAction?: {} | undefined
  }
  TechnicalTasksList: {category: string; title: string}
  TechnicalTaskDetails: {task: any; category: string}
  TechnicalTaskNewComment: {taskId: string}
  AddEditTechnicalTask: {method: string; task?: any}
  TechnicalCertificateList: {certificates: any; title: string}
  TechnicalCertificateDetails: {certificate: any}
  Measurements: {data: any; routeFrom: string}
  TechnicalRoutinesList: {category: string; title: string}
  TechnicalRoutineDetails: {id: any; title: string}
  FinancialInvoiceDetails: {id: string; routeFrom: string; title: string}
  TickerOilPriceDetails: undefined
  AddCrewMember: undefined
  InformationPegelDetails: {pegelId: number}
  ImgViewer: {url: string; title: string}
  CharterAcceptSign: {charter?: any}
  TrackingServiceDialog: undefined
}

type MainStackParamList = {
  ChangeRole: undefined
  Notification: undefined
  MapView: undefined
  Planning: undefined
  Charters: undefined
  Technical: undefined
  Financial: undefined
  Information: undefined
  ToDo: undefined
  Crew: undefined
  QSHE: undefined
  ChangeRole: undefined
  Settings: undefined
}
