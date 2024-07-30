import React from "react";
import "./App.css";
import { TelegramProvider, useTelegram } from "./shared/hooks/useTelegram";
import { Theme } from "@radix-ui/themes";
import { RouterProvider} from "react-router-dom";
import {router} from "./Router";

function App() {
    const { webApp } = useTelegram();
    return (
        <TelegramProvider>
            <Theme
                accentColor="amber"
                appearance={"dark"}
                grayColor="mauve"
                radius="medium"
                hasBackground={false}
            >
                <RouterProvider router={router}/>
            </Theme>
        </TelegramProvider>
    );
}

export default App;
