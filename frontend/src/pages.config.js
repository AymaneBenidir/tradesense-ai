import Admin from './pages/Admin';
import Checkout from './pages/Checkout';
import Community from './pages/Community';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import Leaderboard from './pages/Leaderboard';
import MasterClass from './pages/MasterClass';
import News from './pages/News';
import Pricing from './pages/Pricing';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Admin": Admin,
    "Checkout": Checkout,
    "Community": Community,
    "Dashboard": Dashboard,
    "Landing": Landing,
    "Leaderboard": Leaderboard,
    "MasterClass": MasterClass,
    "News": News,
    "Pricing": Pricing,
}

export const pagesConfig = {
    mainPage: "Landing",
    Pages: PAGES,
    Layout: __Layout,
};