import {create, ResponseTransform} from 'apisauce';
import camelCaseKeys from 'camelcase-keys';
import {API_URL} from '@bluecentury/env';

export const API = create({
  baseURL: API_URL,
});

const dataToCamelCase: ResponseTransform = response => {
  if (response.data) {
    response.data = camelCaseKeys(response.data, {deep: true});
  }
};

API.addResponseTransform(dataToCamelCase);
