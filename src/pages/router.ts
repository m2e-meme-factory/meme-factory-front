import About from "./About";
import ProfilePage from "./ProfilePage/ProfilePage";
import Tasks from "./Tasks";
import TasksPage from "./TasksPage/TasksPage";


export const routes = [
    {
        title: "Profile",
        path: "/profile",
        component: ProfilePage
    },
    {
        title: "Tasks",
        path: "/tasks",
        component: TasksPage
    },
    {
        title: "About",
        path: "/about",
        component: About
    }
]