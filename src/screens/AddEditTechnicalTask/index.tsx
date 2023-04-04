import React, {useEffect, useState} from 'react'
import {TouchableOpacity} from 'react-native'
import {
  Box,
  Button,
  FormControl,
  HStack,
  Icon,
  Input,
  ScrollView,
  Select,
  Text,
  TextArea,
  WarningOutlineIcon,
  Image,
  useToast,
} from 'native-base'
import {ms} from 'react-native-size-matters'
import {Shadow} from 'react-native-shadow-2'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import DatePicker from 'react-native-date-picker'
import * as ImagePicker from 'react-native-image-picker'

import {Colors} from '@bluecentury/styles'
import {useEntity, useTechnical} from '@bluecentury/stores'
import moment from 'moment'
import {
  IconButton,
  LoadingAnimated,
  NoInternetConnectionMessage,
} from '@bluecentury/components'
import {Icons} from '@bluecentury/assets'
import {useTranslation} from 'react-i18next'
import {Task} from '@bluecentury/models'

type Props = NativeStackScreenProps<RootStackParamList>
const AddEditTechnicalTask = ({navigation, route}: Props) => {
  const {t} = useTranslation()
  const {method, task, category} = route.params
  const toast = useToast()
  const {
    isUploadingFileLoading,
    isCreateTaskLoading,
    isTechnicalLoading,
    createVesselTask,
    updateVesselTask,
    uploadFileBySubject,
    getVesselTasksCategory,
    getVesselTasksByCategory,
    getVesselTaskDetails,
  } = useTechnical()
  const {vesselId} = useEntity()
  const types = [
    {
      value: 'Technical_task',
      label: 'Technical Task',
    },
    {
      value: 'Verbeteringen',
      label: 'Verbeteringen',
    },
  ]

  const [taskData, setTaskData] = useState<Task>({
    title: '',
    // exploitationVessel: {id: vesselId},
    deadline: new Date(),
    description: '',
    instructions: '',
  })
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [imgFile, setImgFile] = useState<ImageFile>({
    id: '',
    uri: '',
    fileName: '',
    type: '',
  })

  useEffect(() => {
    if (task !== undefined) {
      setTaskData({
        ...taskData,
        title: task?.title,
        deadline: task?.deadline ? new Date(task?.deadline) : new Date(),
        description: task?.description,
        instructions: task?.instructions,
      })
    }
  }, [task])

  const launchImageLibrary = () => {
    const options: ImagePicker.ImageLibraryOptions = {
      mediaType: 'photo',
    }

    ImagePicker.launchImageLibrary(options, response => {
      if (response?.assets?.length) {
        setImgFile({
          ...imgFile,
          id: response?.assets[0]?.id,
          uri: response?.assets[0]?.uri,
          fileName: response?.assets[0]?.fileName,
          type: response?.assets[0]?.type,
        })
      }
    })
  }

  const showToast = (text: string, res: string) => {
    toast.show({
      duration: 2000,
      render: () => {
        return (
          <Text
            bg={res === 'success' ? 'emerald.500' : 'red.500'}
            color={Colors.white}
            mb={5}
            px="2"
            py="1"
            rounded="sm"
          >
            {text}
          </Text>
        )
      },
    })
  }

  const handleOnCreateNewTask = async () => {
    if (method === 'add') {
      const newTask = Object.assign({}, taskData, {
        exploitationVessel: {id: vesselId},
      })
      const res = await createVesselTask(newTask)
      if (typeof res === 'object' && res?.id) {
        // update data on technical task with categories
        getVesselTasksCategory(vesselId)
        // update the list on the tasks
        getVesselTasksByCategory(vesselId, category)
        showToast(`Task ${method} successfully.`, 'success')
        uploadFile(res?.id, imgFile)
        navigation.goBack()
      } else {
        showToast(`Task ${method} failed.`, 'failed')
      }
    } else {
      const res = await updateVesselTask(task?.id, taskData)
      if (typeof res === 'object' && res?.id) {
        showToast(`Task ${method} successfully.`, 'success')
        uploadFile(res?.id, imgFile)
        getVesselTaskDetails(task?.id)
        // update the list on the tasks
        getVesselTasksByCategory(vesselId, category)
        navigation.goBack()
      } else {
        showToast(`Task ${method} failed.`, 'failed')
      }
    }
  }

  const uploadFile = async (id: number, imageFile: ImageFile) => {
    if (imageFile?.uri) {
      const upload = await uploadFileBySubject(
        'Task',
        imageFile,
        'shared_within_company',
        id
      )
    }
  }

  if (isCreateTaskLoading || isUploadingFileLoading || isTechnicalLoading) {
    return <LoadingAnimated />
  }

  return (
    <Box
      bg={Colors.white}
      borderTopLeftRadius={ms(15)}
      borderTopRightRadius={ms(15)}
      flex="1"
    >
      <NoInternetConnectionMessage />
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 30}}
        p={ms(12)}
      >
        <FormControl isRequired>
          <FormControl.Label color={Colors.disabled}>
            {t('taskName')}
          </FormControl.Label>
          <Input
            bg={'#F7F7F7'}
            returnKeyType="next"
            type="text"
            value={taskData.title}
            onChangeText={e => setTaskData({...taskData, title: e})}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {t('required')}
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl isRequired mt={ms(20)}>
          <FormControl.Label color={Colors.disabled}>
            {t('taskType')}
          </FormControl.Label>
          <Select
            accessibilityLabel=""
            bg={Colors.light_grey}
            minWidth="300"
            placeholder=""
          >
            {types.map((supplier, index) => (
              <Select.Item
                key={index}
                label={supplier.label}
                value={supplier.value}
              />
            ))}
          </Select>
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {t('required')}
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl isRequired mt={ms(20)}>
          <FormControl.Label color={Colors.disabled}>
            {t('deadLine')}
          </FormControl.Label>
          <HStack
            alignItems="center"
            bg={Colors.light_grey}
            borderRadius={ms(5)}
            mt={ms(3)}
            p="2"
          >
            <MaterialCommunityIcons
              color={Colors.danger}
              name="calendar-month-outline"
              size={ms(22)}
            />
            <TouchableOpacity
              style={{
                flex: 1,
                marginLeft: 10,
              }}
              activeOpacity={0.7}
              onPress={() => setOpenDatePicker(true)}
            >
              <Text
                color={taskData.deadline ? Colors.text : Colors.disabled}
                fontSize={ms(16)}
                fontWeight="medium"
              >
                {taskData.deadline
                  ? moment(taskData.deadline).format('D MMM YYYY')
                  : ''}
              </Text>
            </TouchableOpacity>
            <MaterialIcons name="keyboard-arrow-down" size={ms(22)} />
          </HStack>
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {t('required')}
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl isRequired mt={ms(20)}>
          <FormControl.Label color={Colors.disabled}>
            {t('description')}
          </FormControl.Label>
          <TextArea
            autoCompleteType={undefined}
            h="100"
            numberOfLines={4}
            placeholder=""
            style={{backgroundColor: '#F7F7F7'}}
            value={taskData.description}
            onChangeText={e => setTaskData({...taskData, description: e})}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {t('required')}
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl isRequired mt={ms(20)}>
          <FormControl.Label color={Colors.disabled}>
            {t('instructions')}
          </FormControl.Label>
          <TextArea
            autoCompleteType={undefined}
            h="100"
            numberOfLines={4}
            placeholder=""
            style={{backgroundColor: '#F7F7F7'}}
            value={taskData.instructions}
            onChangeText={e => setTaskData({...taskData, instructions: e})}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {t('required')}
          </FormControl.ErrorMessage>
        </FormControl>
        {imgFile.uri !== '' || imgFile.fileName !== '' ? (
          <HStack
            alignItems="center"
            justifyContent="space-between"
            mt={ms(15)}
          >
            <Image
              alt="file-preview"
              borderRadius={ms(5)}
              h={ms(45)}
              source={{uri: imgFile.uri}}
              w={ms(45)}
            />
            <Text
              ellipsizeMode="middle"
              fontWeight="medium"
              maxW="70%"
              numberOfLines={1}
            >
              {imgFile.fileName}
            </Text>
            <IconButton
              size={ms(25)}
              source={Icons.close}
              onPress={() => setImgFile({...imgFile, uri: '', fileName: ''})}
            />
          </HStack>
        ) : null}

        <Button
          bg={Colors.primary}
          leftIcon={<Icon as={Ionicons} name="camera" size="sm" />}
          mb={ms(20)}
          mt={ms(20)}
          onPress={launchImageLibrary}
        >
          {t('uploadImage')}
        </Button>
        <DatePicker
          modal
          date={taskData.deadline}
          mode="datetime"
          open={openDatePicker}
          onConfirm={date => {
            setOpenDatePicker(false), setTaskData({...taskData, deadline: date})
          }}
          onCancel={() => setOpenDatePicker(false)}
        />
      </ScrollView>
      <Box bg={Colors.white} position="relative">
        <Shadow
          viewStyle={{
            width: '100%',
          }}
          distance={25}
        >
          <HStack>
            <Button
              colorScheme="muted"
              flex="1"
              m={ms(16)}
              variant="ghost"
              onPress={() => navigation.goBack()}
            >
              {t('cancel')}
            </Button>
            <Button
              bg={Colors.primary}
              flex="1"
              m={ms(16)}
              onPress={handleOnCreateNewTask}
            >
              {t('save')}
            </Button>
          </HStack>
        </Shadow>
      </Box>
    </Box>
  )
}

export default AddEditTechnicalTask
