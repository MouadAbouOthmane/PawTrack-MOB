import API from '../services/api';

export const allInfraction = async () => {
  const response = await API.get('/infractions-of-the-day');
  return response;
};

export const submitInfractionApi = async data => {
  console.log(data);
  const response = await API.post('/infractions', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};

export const typeInfraction = async () => {
  const response = await API.get('/type-infractions');
  return response;
};

export const getInfraction = async id => {
  const response = await API.get(`/infractions/${id}`);
  return response;
};

export const processPayment = async id => {
  const response = await API.post(`/infractions/${id}/pay`);
  return response;
};

export const searchInfractionByQrCode = async qrCode => {
  const response = await API.get(`/infractions/search/qr_code`, {
    params: {qr_code: qrCode},
  });
  return response;
};
export const searchInfractionByMatricule = async matricule => {
  const response = await API.get(`/infractions/search/matricule`, {
    params: {matricule: matricule},
  });
  return response;
};
