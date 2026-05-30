import io from 'socket.io-client';
import api, { getBaseUrl } from './api';

export const getSocketUrl = () => {
  return process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL.replace('/api', '')
    : getBaseUrl().replace('/api', '');
};

export const subscribeToCounter = (callback) => {
  const socketUrl = getSocketUrl();
  let socket = null;

  try {
    socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 2,
      timeout: 3000
    });
    socket.on('counter-update', (data) => {
      callback(Number(data.totalApprovedElectors) || 0);
    });
    socket.on('connect_error', () => {
      if (socket) socket.close();
    });
  } catch {}

  const interval = setInterval(async () => {
    try {
      const res = await api.get('/electors/live-total');
      callback(Number(res.data.totalApprovedElectors) || 0);
    } catch {}
  }, 10000);

  return () => {
    if (socket) socket.disconnect();
    clearInterval(interval);
  };
};
