import axios from 'axios';

export const uploadBanner = async (file: File[]): Promise<[{ name: string, url: string }]> => {
  const formData = new FormData();
  formData.append('files', file[0]);

  const response = await axios.post<any>('https://api.meme-factory.site/files?folder=projects', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return response.data;
};
