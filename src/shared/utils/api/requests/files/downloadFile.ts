import axios from 'axios';

export const downloadImage = (url: string) => {
  axios({
    url: url,
    method: 'GET',
    responseType: 'blob'
  })
    .then((response) => {
      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'image.jpg');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Error: Received non-200 status code');
      }
    })
    .catch((error) => {
      console.error('Error downloading the image:', error);
    });
}