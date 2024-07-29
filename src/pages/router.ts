import About from "./About";
import Profile from "./Profile";
import Tasks from "./Tasks";
import TasksPage from "./TasksPage/TasksPage";


export const routes = [
    {
        title: "Profile",
        path: "/profile",
        component: Profile
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