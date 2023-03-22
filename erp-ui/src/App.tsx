import React from "react";
import {Refine} from "@pankod/refine-core";
import {
    notificationProvider,
    Layout,
    ReadyPage,
    ErrorComponent,
    ConfigProvider,
} from "@pankod/refine-antd";
import ruRU from "antd/locale/ru_RU";
import dataProvider from "@pankod/refine-simple-rest";
import routerProvider from "@pankod/refine-react-router-v6";
import {AntdInferencer} from "@pankod/refine-inferencer/antd";
import {RefineKbarProvider} from "@pankod/refine-kbar";
import {SettingOutlined} from "@ant-design/icons";

import {ColorModeContextProvider} from "contexts";
import {OffLayoutArea} from "components/offLayoutArea";
import {authProvider} from "./authProvider";
import { accessControlProvider } from './accessControlProvider';
import {PersonCreate} from "./components/PersonCreate";
import {EmployeeList} from "./components/employees/EmployeeList";
import {EmployeeShow} from "./resources/employee/EmployeeShow";
import {EmployeeCreate} from "./resources/employee/EmployeeCreate";
import {InvoicesList} from "./components/invoices/InvoicesList";
import {InvoicesCreate} from "./components/invoices/InvoicesCreate";
import {LoginPage} from "./pages/LoginPage";
import {API_BASE_URL} from "./api";
import {Header} from "./components/layout";
import {UserListPage} from "./pages/user/UserListPage";
import {UserCreatePage} from "./pages/user/UserCreatePage";
import {UserEditPage} from "./pages/user/UserEditPage";

import "@pankod/refine-antd/dist/reset.css";

function App() {
    return (
        <ColorModeContextProvider>
            <RefineKbarProvider>
                <ConfigProvider locale={ruRU}>
                    <Refine
                        dataProvider={dataProvider(API_BASE_URL)}
                        notificationProvider={notificationProvider}
                        Layout={Layout}
                        Header={Header}
                        ReadyPage={ReadyPage}
                        catchAll={<ErrorComponent/>}
                        routerProvider={routerProvider}
                        authProvider={authProvider}
                        LoginPage={LoginPage}
                        OffLayoutArea={OffLayoutArea}
                        resources={[
                            {
                                name: "persons",
                                list: AntdInferencer,
                                create: PersonCreate,
                                show: AntdInferencer,
                                edit: AntdInferencer,
                            },
                            {
                                name: "employees",
                                list: EmployeeList,
                                show: EmployeeShow,
                                create: EmployeeCreate,
                                edit: AntdInferencer,
                                options: {
                                    label: "Сотрудники",
                                }
                            },
                            {
                                name: "invoices",
                                list: InvoicesList,
                                show: AntdInferencer,
                                create: InvoicesCreate,
                                edit: AntdInferencer,
                                options: {
                                    label: "Счета",
                                }
                            },
                            {
                                name: "admin",
                                icon: <SettingOutlined/>,
                                list: () => null,
                                options: {
                                    label: "Установки"
                                }
                            },
                            {
                                name: "users",
                                parentName: "admin",
                                list: UserListPage,
                                create: UserCreatePage,
                                edit: UserEditPage,
                                canDelete: true,
                                options: {
                                    label: "Пользователи"
                                }
                            }
                        ]}
                        accessControlProvider={accessControlProvider}
                    />
                </ConfigProvider>
            </RefineKbarProvider>
        </ColorModeContextProvider>
    );
}

export default App;
