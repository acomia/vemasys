import {API} from '../../apiService';

const reloadEntityUsers = () => {
  return API.get<any>('v2/active_entity_users')
    .then(response => {
      if (response.data) {
        return response.data;
      } else {
        throw Error('Request Failed');
      }
    })
    .catch(error => {
      console.error('Error: API Login ', error);
    });
};

const selectEntityUser = (entityId: string) => {
  return API.setHeader('X-active-entity-user-id', `${entityId}`);
};

export {reloadEntityUsers, selectEntityUser};
