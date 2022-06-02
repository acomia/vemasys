import React from 'react';
import {NativeBaseProvider} from 'native-base';

interface Props {
  children: React.ReactNode;
}

export default function AppContainer({children}: Props) {
  return <NativeBaseProvider>{children}</NativeBaseProvider>;
}
