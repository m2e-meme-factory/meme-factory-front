import {useMutation} from "@tanstack/react-query";
import {verifyUser, VerifyUserConfig} from "../requests/verifyUser";

export const useVerifyUser = () => {
    useMutation({
        mutationFn: (config: VerifyUserConfig) => verifyUser(config)
    });
}