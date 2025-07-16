export const togglePortalEffect = () => {
  const portalEl = document.querySelector('#portal');
  portalEl?.classList.toggle('portal-effect');
};
interface socketSession {
  expires_at: string;
}

export const createSocketSession = ({ expires_at }: socketSession) => {
  localStorage.setItem(
    'user_socket_session',
    JSON.stringify(new Date(expires_at))
  );
};

// export const updateSocketSession = (sessionId: string, socketId: string) => {
//   const expires_at = JSON.parse(localStorage.getItem('user_socket_session')!);
//   if (!expires_at) console.log('socket session not found!');
//   const updatedSession = JSON.stringify({
//     ...expires_at,
//     socketId,
//     sessionId,
//   });
//   localStorage.setItem('user_socket_session', updatedSession);
// };
