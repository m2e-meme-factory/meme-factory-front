import {TelegramProvider} from "./shared/hooks/useTelegram";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactNode} from "react";

const queryClient = new QueryClient();

const ProviderWrapper = ({ children }: { children: ReactNode }) => {
    return (
        <TelegramProvider>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </TelegramProvider>
    );
};

export default ProviderWrapper;