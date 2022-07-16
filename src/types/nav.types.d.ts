type RootStackParamList = {
  Splash: undefined
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
  AddEditComment: {comment?: any; method: string; routeFrom?: string}
  AddEditNavlogAction: {method: string; navlogAction?: {} | undefined}
  TechnicalTasksList: {category: string; title: string}
  TechnicalTaskDetails: {task: any; category: string}
  TechnicalTaskNewComment: {taskId: string}
  AddEditTechnicalTask: {method: string; task?: any}
  TechnicalCertificateList: {certificates: any; title: string}
  TechnicalCertificateDetails: {certificate: any}
  Measurements: {reservoir: any; lastMeasurement?: []}
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
