import axios from 'axios';

export const uploadFiles = async (files: File[]): Promise<[{ name: string, url: string }]> => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });

  const response = await axios.post<any>('https://api.meme-factory.site/files?folder=projects', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return response.data;
};
