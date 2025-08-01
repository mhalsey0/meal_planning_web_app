import WeatherForecast from "../Components/WeatherForecast.jsx";
import LogoutLink from "../Components/LogoutLink.jsx";
import AuthorizeView, { AuthorizedUser } from "../Components/AuthorizeView.jsx";
import NavBar from "../Components/NavigationBar.jsx";
import Calendar from "../Components/Calendar.jsx";

function Home() {
    return (
        <AuthorizeView>
            <span><LogoutLink>Logout <AuthorizedUser value="email" /></LogoutLink></span>
            <NavBar />
            <Calendar />
            <WeatherForecast />
        </AuthorizeView>
    );
}

export default Home;