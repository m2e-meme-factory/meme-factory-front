import { useMutation } from '@tanstack/react-query';
import { verifyUser, VerifyUserConfig } from '../../requests/user/verifyUser';
import { showSuccessMessage } from '../../../helpers/notify';

export const useVerifyUser = () =>
  useMutation({
    mutationFn: (config: VerifyUserConfig) => verifyUser(config),
    onSuccess: () => showSuccessMessage('You are verified!'),
  });
