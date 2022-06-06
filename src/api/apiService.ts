import {create, ResponseTransform} from 'apisauce';
import Config from 'react-native-dotenv';
import camelCaseKeys from 'camelcase-keys';

export const API = create({
  baseURL: Config.API_URL,
});

const dataToCamelCase: ResponseTransform = response => {
  if (response.data) {
    response.data = camelCaseKeys(response.data, {deep: true});
  }
};

API.addResponseTransform(dataToCamelCase);
