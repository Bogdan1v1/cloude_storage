import axios from './index';
import type { RegisterFormDTO, LoginFormDTO, AuthResponse } from './dto';

export const authApi = {
  register: async (values: RegisterFormDTO) => {
    return axios.post('/auth/register', values);
  },
  
  login: async (values: LoginFormDTO) => {
    return axios.post<AuthResponse>('/auth/login', values);
  },

  getMe: async () => {
    return axios.get('/users/me');
  }
};