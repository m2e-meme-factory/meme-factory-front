import React from "react";
import "./App.css";
import { TelegramProvider, useTelegram } from "./hooks/useTelegram";
import { Heading, Theme } from "@radix-ui/themes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import VerifyForm from "./pages/VerifyForm";
import Profile from "./pages/Profile";
import BasePageWrapper from "./components/BasePageWrapper";
import { routes } from "./pages/router";
import TasksPage from "./pages/TasksPage/TasksPage";
import TaskPage from "./pages/TaskPage/TaskPage"; // Импорт нового компонента

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
                <BrowserRouter>
                    <Routes>
                        <Route path="*" element={<h1>404 Error</h1>} />
                        {routes.map((route, i) => (
                            <Route
                                key={i}
                                path={route.path}
                                element={
                                    <BasePageWrapper>
                                        <route.component />
                                    </BasePageWrapper>
                                }
                            />
                        ))}
                        <Route path="/verify" element={<VerifyForm />} />
                        <Route
                            path="/profile"
                            element={
                                <BasePageWrapper>
                                    <Profile />
                                </BasePageWrapper>
                            }
                        />
                        <Route
                            path="/tasks"
                            element={
                                <BasePageWrapper>
                                    <TasksPage />
                                </BasePageWrapper>
                            }
                        />
                        <Route
                            path="/tasks/:id"
                            element={<TaskPage />}
                        />
                        <Route
                            path="/about"
                            element={
                                <BasePageWrapper>
                                    <Heading m="4">About</Heading>
                                </BasePageWrapper>
                            }
                        />
                    </Routes>
                </BrowserRouter>
                {/* <DriverForm /> */}
                {/* <Combobox /> */}
            </Theme>
        </TelegramProvider>
    );
}

export default App;
