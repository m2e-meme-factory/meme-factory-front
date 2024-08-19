import api from '../../api';
import { CreateEventDto, RequestConfig } from 'api';
import { addAuthorizationHeader } from '../project/project-requests';

export type CreateEventConfig = RequestConfig<CreateEventDto>;

export const createEvent = (config: CreateEventConfig) => {
  const newConfig = addAuthorizationHeader(config.config);
  return api.post('/events', config.params, newConfig);
};
