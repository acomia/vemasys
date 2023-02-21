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
import {IconButton, LoadingAnimated, NoInternetConnectionMessage} from '@bluecentury/components'
import {Icons} from '@bluecentury/assets'
import {useTranslation} from 'react-i18next'

type Props = NativeStackScreenProps<RootStackParamList>
const AddEditTechnicalTask = ({navigation, route}: Props) => {
  const {t} = useTranslation()
  const {method, task} = route.params
  const toast = useToast()
  const {
    isTechnicalLoading,
    createVesselTask,
    updateVesselTask,
    uploadFileBySubject,
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
    let options: ImagePicker.ImageLibraryOptions = {
      mediaType: 'photo',
    }

    ImagePicker.launchImageLibrary(options, response => {
      setImgFile({
        ...imgFile,
        id: response.assets[0].id,
        uri: response.assets[0].uri,
        fileName: response.assets[0].fileName,
        type: response.assets[0].type,
      })
    })
  }

  const showToast = (text: string, res: string) => {
    toast.show({
      duration: 1000,
      render: () => {
        return (
          <Text
            bg={res === 'success' ? 'emerald.500' : 'red.500'}
            px="2"
            py="1"
            rounded="sm"
            mb={5}
            color={Colors.white}
          >
            {text}
          </Text>
        )
      },
      onCloseComplete() {
        res === 'success' ? navigation.goBack() : null
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
        const upload = await uploadFileBySubject(
          'Task',
          imgFile,
          'shared_within_company',
          res?.id
        )
        if (typeof upload === 'object') {
          showToast('Task add successfully.', 'success')
        }
      } else {
        showToast('Task add failed.', 'failed')
      }
    } else {
      const res = await updateVesselTask(task?.id, taskData)
      if (typeof res === 'object' && res?.id) {
        const upload = await uploadFileBySubject(
          'Task',
          imgFile,
          'shared_within_company',
          res?.id
        )
        if (typeof upload === 'object') {
          showToast('Task update successfully.', 'success')
        }
      } else {
        showToast('Task update failed.', 'failed')
      }
    }
  }

  if (isTechnicalLoading) return <LoadingAnimated />

  return (
    <Box
      flex="1"
      bg={Colors.white}
      borderTopLeftRadius={ms(15)}
      borderTopRightRadius={ms(15)}
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
            type="text"
            returnKeyType="next"
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
            minWidth="300"
            accessibilityLabel=""
            placeholder=""
            bg="#F7F7F7"
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
            mt={ms(3)}
            bg="#F7F7F7"
            borderRadius={ms(5)}
            p="2"
            alignItems="center"
          >
            <MaterialCommunityIcons
              name="calendar-month-outline"
              size={ms(22)}
              color={Colors.danger}
            />
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                flex: 1,
                marginLeft: 10,
              }}
              onPress={() => setOpenDatePicker(true)}
            >
              <Text
                fontSize={ms(16)}
                fontWeight="medium"
                color={taskData.deadline ? Colors.text : Colors.disabled}
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
            numberOfLines={4}
            h="100"
            placeholder=""
            style={{backgroundColor: '#F7F7F7'}}
            autoCompleteType={undefined}
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
            numberOfLines={4}
            h="100"
            placeholder=""
            style={{backgroundColor: '#F7F7F7'}}
            autoCompleteType={undefined}
            value={taskData.instructions}
            onChangeText={e => setTaskData({...taskData, instructions: e})}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {t('required')}
          </FormControl.ErrorMessage>
        </FormControl>
        {imgFile.uri !== '' || imgFile.fileName !== '' ? (
          <HStack
            mt={ms(15)}
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              alt="file-preview"
              source={{uri: imgFile.uri}}
              w={ms(45)}
              h={ms(45)}
              borderRadius={ms(5)}
            />
            <Text
              maxW="70%"
              fontWeight="medium"
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {imgFile.fileName}
            </Text>
            <IconButton
              source={Icons.close}
              onPress={() => setImgFile({...imgFile, uri: '', fileName: ''})}
              size={ms(25)}
            />
          </HStack>
        ) : null}

        <Button
          bg={Colors.primary}
          leftIcon={<Icon as={Ionicons} name="camera" size="sm" />}
          mt={ms(20)}
          mb={ms(20)}
          onPress={launchImageLibrary}
        >
          {t('uploadImage')}
        </Button>
        <DatePicker
          modal
          open={openDatePicker}
          date={taskData.deadline}
          mode="datetime"
          onConfirm={date => {
            setOpenDatePicker(false), setTaskData({...taskData, deadline: date})
          }}
          onCancel={() => setOpenDatePicker(false)}
        />
      </ScrollView>
      <Box bg={Colors.white} position="relative">
        <Shadow
          distance={25}
          viewStyle={{
            width: '100%',
          }}
        >
          <HStack>
            <Button
              flex="1"
              m={ms(16)}
              variant="ghost"
              colorScheme="muted"
              onPress={() => navigation.goBack()}
            >
              {t('cancel')}
            </Button>
            <Button
              flex="1"
              m={ms(16)}
              bg={Colors.primary}
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
