import React from 'react'
import {
  Box,
  Divider,
  FormControl,
  Input,
  ScrollView,
  Text,
  WarningOutlineIcon
} from 'native-base'
import {ms} from 'react-native-size-matters'
import {Colors} from '@bluecentury/styles'

const AddCrewMember = () => {
  return (
    <Box flex="1">
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}
        scrollEventThrottle={16}
        px={ms(12)}
        py={ms(20)}
        bg={Colors.white}
      >
        <Text fontSize={ms(16)} fontWeight="bold" color={Colors.text}>
          User Information
        </Text>
        <Divider mt={ms(5)} mb={ms(10)} />
        <FormControl mt={ms(10)}>
          <FormControl.Label color={Colors.disabled}>
            First name
          </FormControl.Label>
          <Input
            placeholder=" "
            style={{backgroundColor: '#F7F7F7'}}
            // value={taskData.description}
            // onChangeText={e => setTaskData({...taskData, description: e})}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            Required
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl mt={ms(10)}>
          <FormControl.Label color={Colors.disabled}>
            Last name
          </FormControl.Label>
          <Input
            placeholder=" "
            style={{backgroundColor: '#F7F7F7'}}
            // value={taskData.description}
            // onChangeText={e => setTaskData({...taskData, description: e})}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            Required
          </FormControl.ErrorMessage>
        </FormControl>
      </ScrollView>
    </Box>
  )
}

export default AddCrewMember
