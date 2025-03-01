import { createPortal } from 'react-dom';
export default function Portal({ children }: any) {
  const portalEl = document.querySelector('#portal');
  portalEl?.classList.add('portal-effect');
  return createPortal(children, portalEl!);
}
