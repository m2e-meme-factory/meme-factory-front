import About from "./About";
import Profile from "./Profile";
import Tasks from "./Tasks";


export const routes = [
    {
        title: "Profile",
        path: "/profile",
        component: Profile
    },
    {
        title: "Tasks",
        path: "/tasks",
        component: Tasks
    },
    {
        title: "About",
        path: "/about",
        component: About
    }
]