import axios from './index';
import { FileType } from './dto';
import type { FileDTO } from './dto';

export const filesApi = {
  getAll: async (parentId: number | null = null, type: FileType = FileType.PHOTOS) => {
    return axios.get<FileDTO[]>('/files', {
      params: { parentId, type }
    });
  },

  createFolder: async (name: string, parentId: number | null = null) => {
    return axios.post('/files/folder', {
      name,
      parentId
    });
  },

 
  uploadFile: async (file: File, parentId: number | null = null) => {
    const formData = new FormData();
    formData.append('file', file);

    return axios.post('/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      params: {
        parentId
      }
    });
  },
  getOne: async (id: number) => {
    return axios.get<FileDTO>(`/files/${id}`);
  },
  update: async (id: number, originalName: string) => {
    return axios.patch(`/files/${id}`, { originalName });
  },
  remove: async (ids: number[]) => {
    return axios.delete('/files?ids=' + ids.join(','));
  }
};