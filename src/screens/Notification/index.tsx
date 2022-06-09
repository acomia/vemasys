import React from 'react';
import {
  View,
  Text,
  SectionList,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {Divider} from 'native-base';
import moment from 'moment';

import {icons} from '@bluecentury/assets';

const screenWidth = Dimensions.get('screen').width;

export default function Notification() {
  const dummy = [
    {
      id: 1,
      vessel: 'AZZURRO',
      description:
        ' has departed from Pannerdsche Kop ( Waal - Pannerdsch kanaal )',
      date: new Date(),
      read: false,
    },
    {
      id: 2,
      vessel: 'AZZURRO',
      description:
        ' has departed from Pannerdsche Kop ( Waal - Pannerdsch kanaal )',
      date: new Date(),
      read: false,
    },
    {
      id: 3,
      vessel: 'AZZURRO',
      description:
        ' has departed from Pannerdsche Kop ( Waal - Pannerdsch kanaal )',
      date: new Date(),
      read: false,
    },
    {
      id: 4,
      vessel: 'AZZURRO',
      description:
        ' has departed from Pannerdsche Kop ( Waal - Pannerdsch kanaal )',
      date: new Date('2021-01-01'),
      read: false,
    },
    {
      id: 5,
      vessel: 'AZZURRO',
      description:
        ' has departed from Pannerdsche Kop ( Waal - Pannerdsch kanaal )',
      date: new Date('2021-01-01'),
      read: true,
    },
    {
      id: 6,
      vessel: 'AZZURRO',
      description:
        ' has departed from Pannerdsche Kop Lorem qewuf sk ( Waal - Pannerdsch kanaal )',
      date: new Date('2021-01-01'),
      read: true,
    },
    {
      id: 7,
      vessel: 'AZZURRO',
      description:
        ' has departed from Pannerdsche Kop ( Waal - Pannerdsch kanaal )',
      date: new Date('2021-01-01'),
      read: true,
    },
    {
      id: 8,
      vessel: 'AZZURRO',
      description:
        ' has departed from Pannerdsche Kop ( Waal - Pannerdsch kanaal )',
      date: new Date('2021-01-01'),
      read: true,
    },
    {
      id: 9,
      vessel: 'AZZURRO',
      description:
        ' has departed from Pannerdsche Kop ( Waal - Pannerdsch kanaal )',
      date: new Date('2021-01-01'),
      read: true,
    },
    {
      id: 10,
      vessel: 'AZZURRO',
      description:
        ' has departed from Pannerdsche Kop ( Waal - Pannerdsch kanaal )',
      date: new Date('2021-01-01'),
      read: true,
    },
  ];

  let groupByDate = Object.values(
    dummy.reduce((acc, item) => {
      if (!acc[item.date])
        acc[item.date] = {
          date: item.date,
          data: [],
        };
      acc[item.date].data.push(item);
      return acc;
    }, {}),
  );

  const Item = ({item}: any) => (
    <View
      style={[
        notificationStyles.itemContainer,
        {borderColor: !item.read ? '#BEE3F8' : '#E0E0E0'},
      ]}>
      <Image
        source={icons.completed}
        style={notificationStyles.itemIcon}
        resizeMode="contain"
      />
      <View style={{paddingLeft: 10}}>
        <Text style={notificationStyles.description}>
          <Text style={notificationStyles.descriptionHighlighted}>
            {item.vessel}
          </Text>
          {item.description}
        </Text>
        <Text style={notificationStyles.notificationDate}>
          {moment(new Date().toLocaleDateString()).isSame(
            moment(new Date(item.date).toLocaleDateString()),
          )
            ? `Today | ${moment(item.date).format('LT')}`
            : moment(item.date).format('lll')}
        </Text>
      </View>
      {!item.read && <View style={notificationStyles.unreadIndicator} />}
    </View>
  );

  const HeaderSection = ({title}: any) => (
    <View style={notificationStyles.headerContainer}>
      <Text style={notificationStyles.header}>
        {moment(new Date().toLocaleDateString()).isSame(
          moment(new Date(title).toLocaleDateString()),
        )
          ? `Today`
          : moment(title).format('ll')}
      </Text>
      <Divider my="2" />
    </View>
  );

  return (
    <View style={notificationStyles.container}>
      <View style={notificationStyles.content}>
        <SectionList
          sections={groupByDate}
          keyExtractor={(item, index) => item + index}
          renderItem={({item}) => <Item item={item} />}
          renderSectionHeader={({section: {date}}) => (
            <HeaderSection title={date} />
          )}
          contentContainerStyle={{paddingBottom: 20}}
          stickySectionHeadersEnabled
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const notificationStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    backgroundColor: '#fff',
    padding: 14,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 5,

    //shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContainer: {backgroundColor: '#fff'},
  header: {
    fontSize: 16,
    fontWeight: '600',
    color: '#23475C',
    marginVertical: 10,
  },
  descriptionHighlighted: {
    fontSize: 15,
    fontWeight: '600',
    color: '#29B7EF',
  },
  description: {
    fontSize: 15,
    maxWidth: screenWidth - 100,
  },
  itemIcon: {width: 35, height: 35},
  unreadIndicator: {
    position: 'absolute',
    backgroundColor: '#00A3FF',
    top: 0,
    bottom: 0,
    left: 0,
    width: 8,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  notificationDate: {fontSize: 13, color: '#ADADAD', marginTop: 5},
});
