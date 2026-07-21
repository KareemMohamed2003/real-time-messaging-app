import { useMutation } from '@tanstack/react-query';
import { createRoomQuery } from '../../../shared/lib/api/queries';
type roomData = { name: string; uuid: string };
export default function UseAddRoom(
  successCallback?: (data: any) => void,
  errorCb?: (error: Error) => void
) {
  return useMutation({
    mutationFn: async ({ name, uuid }: roomData) =>
      await createRoomQuery(name, uuid),
    onSuccess: successCallback,
    onError: errorCb,
  });
}
