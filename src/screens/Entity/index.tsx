import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  Box,
  FlatList,
  Heading,
  Avatar,
  HStack,
  VStack,
  Text,
  Spacer,
  Divider,
  Button,
  Image,
} from 'native-base';
import {CommonActions, useRoute} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ms} from 'react-native-size-matters';

import {useEntity, useAuth} from '@bluecentury/stores';
import {icons} from '@bluecentury/assets';
import {Colors} from '@bluecentury/styles';
import {PROD_URL} from '@bluecentury/env';

type Props = NativeStackScreenProps<RootStackParamList>;

export default function Entity({navigation}: Props) {
  const {
    entityUsers,
    entityUserId,
    isLoadingEntityUsers,
    getEntityUsers,
    selectEntityUser,
  } = useEntity();
  const {logout, token} = useAuth();
  const routeName = useRoute().name;

  useEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
    });
    if (!token) {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'Login'}],
        }),
      );
    }

    getEntityUsers();
  }, [navigation, token]);

  const onSelectEntityUser = (entity: any) => {
    selectEntityUser(entity);
    if (routeName === 'SelectEntity') {
      navigation.navigate('Main');
    } else {
      navigation.goBack();
    }
  };

  const onUserLogout = () => {
    logout();
  };

  return (
    <View style={styles.container}>
      <Box
        p="15px"
        backgroundColor="#fff"
        borderTopRightRadius={15}
        borderTopLeftRadius={15}>
        <Heading fontSize="xl" pb="2">
          Roles
        </Heading>
        <Divider mb="5" />
        {isLoadingEntityUsers ? (
          <ActivityIndicator size={'large'} />
        ) : (
          <FlatList
            data={entityUsers}
            renderItem={({item}: any) => {
              let selected = entityUserId && item?.id === entityUserId;
              return (
                <Box
                  key={item?.id}
                  pl="4"
                  pr="5"
                  py="2"
                  my="1.5"
                  bg="#fff"
                  shadow={'1'}
                  borderColor="#F0F0F0"
                  borderWidth="1"
                  borderRadius="md">
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => onSelectEntityUser(item)}>
                    <HStack space={3} justifyContent="space-between">
                      <Avatar
                        size="48px"
                        source={{
                          uri: item?.entity?.icon
                            ? `${PROD_URL}/upload/documents/${item?.entity?.icon?.path}`
                            : '',
                        }}
                      />
                      <VStack>
                        <Text bold>{item?.entity?.alias}</Text>
                        <Text color={Colors.primary}>{item?.role?.title}</Text>
                      </VStack>
                      <Spacer />
                      {selected ? (
                        <Button
                          size="xs"
                          h={ms(24)}
                          py="1"
                          alignSelf="center"
                          textAlign="center"
                          backgroundColor={Colors.secondary}>
                          <Text fontSize={ms(12)} color="#fff" bold>
                            active
                          </Text>
                        </Button>
                      ) : null}
                    </HStack>
                  </TouchableOpacity>
                </Box>
              );
            }}
            keyExtractor={(item: any) => `Entity-${item?.id}`}
            contentContainerStyle={{paddingBottom: 120}}
            showsVerticalScrollIndicator={false}
          />
        )}
      </Box>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#fff',
          justifyContent: 'center',
          padding: 15,
        }}>
        <Button
          mb={'10px'}
          size={'md'}
          backgroundColor={Colors.danger}
          leftIcon={
            <Image
              alt="logout-img"
              source={icons.logout}
              resizeMode="contain"
              style={{width: 20, height: 20}}
            />
          }
          onPress={onUserLogout}>
          Log out
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  loadingContainer: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
