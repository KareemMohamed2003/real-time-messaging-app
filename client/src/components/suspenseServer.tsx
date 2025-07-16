import { getUserQuery } from '@/app/lib/api/queries';
import { ReactNode } from 'react';

export default async function SuspenseServer({
  children,
}: {
  children: ReactNode;
}) {
  const res = await getUserQuery();
// use(res);
  return <>{children}</>;
}
