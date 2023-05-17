/* eslint-disable react-native/no-inline-styles */
import React from 'react'
import {Box, Button, Divider, Modal, Pressable, Text} from 'native-base'
import {ms} from 'react-native-size-matters'
import {Colors} from '@bluecentury/styles'

interface IStatusModalProps {
  isOpen: boolean
  setOpen: () => void
  title: string
  options: Array<{label: string; value: string}>
  onPressStatus: (option: string) => void
}

export default function TechnicalBottomModal({
  isOpen,
  setOpen,
  title,
  options,
  onPressStatus,
}: IStatusModalProps) {
  const labelColor = (val: string) => {
    switch (val) {
      case 'todo':
        return Colors.warning
      case 'in_progress':
        return Colors.highlighted_text
      case 'done':
        return Colors.primary
      default:
        return Colors.warning
    }
  }

  return (
    <Modal animationPreset="slide" flex="1" isOpen={isOpen} onClose={setOpen}>
      <Modal.Content style={{marginBottom: 0, marginTop: 'auto'}} width="99%">
        <Modal.Header alignItems="center">
          <Text bold color={Colors.text} fontSize={ms(13)}>
            {title}
          </Text>
        </Modal.Header>
        {options.map((option, key) => (
          <Box key={`status-${key}`}>
            <Pressable
              alignItems="center"
              justifyContent="center"
              my={3}
              onPress={() => onPressStatus(option.value)}
            >
              <Text bold color={labelColor(option.value)} fontSize={ms(13)}>
                {option.label}
              </Text>
            </Pressable>
            <Divider />
          </Box>
        ))}
      </Modal.Content>
      <Box my={5} w="92%">
        <Button
          bg={Colors.white}
          borderRadius={ms(10)}
          colorScheme={Colors.white}
          size="lg"
          onPress={setOpen}
        >
          <Text color={Colors.disabled} textAlign="center">
            Cancel
          </Text>
        </Button>
      </Box>
    </Modal>
  )
}
