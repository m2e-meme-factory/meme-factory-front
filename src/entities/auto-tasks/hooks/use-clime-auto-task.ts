import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { t } from 'i18next';

import { LOCAL_TEXT } from '@shared/consts';
import { claimAutotaskReward } from '@shared/utils/api/requests/autotask/claimAutotaskReward';
import { showErrorMessage, showSuccessMessage } from '@shared/utils/helpers/notify';

import { QUERY_KEYS } from '@shared/consts/query-keys';

export const useClimeAutoTask = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: claimAutotaskReward,
    onError: (error: AxiosError) => {
      const response = error.response?.data as {
        error: string;
        message: string;
        statusCode: number;
      };
      if (response) {
        showErrorMessage(response.message || t(LOCAL_TEXT.AN_UNKNOWN_ERROR_OCCURRED));
      } else {
        showErrorMessage(t(LOCAL_TEXT.AN_UNKNOWN_ERROR_OCCURRED));
      }
    },
    onSuccess: () => {
      showSuccessMessage(t(LOCAL_TEXT.REWARD_CLAIMED_SUCCESSFULLY));
      return true;
    },
    onSettled: () => {
      client.resetQueries({ queryKey: [QUERY_KEYS.AUTOTASKS] });
      client.invalidateQueries({ queryKey: [QUERY_KEYS.AUTOTASKS] });
    },
  });
};

