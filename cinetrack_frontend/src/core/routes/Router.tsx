import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import ActorRegister from "../pages/ActorRegister";
import DirectorRegister from "../pages/DirectorRegister";
import GenreRegister from "../pages/GenreRegister";
import MovieListPage from "../pages/MovieList";
import MovieRegister from "../pages/MovieRegister";

export const AppRoutes = () => {
    return (
        <Router basename="/Cinetrack">
            <Routes>
                 <Route path="/" element={<MovieListPage/>} />
                 <Route path="/Movies" element={<MovieListPage/>} />
                 <Route path="/Register/Movie" element={<MovieRegister/>} />
                 <Route path="/Register/Actor" element={<ActorRegister/>} />
                 <Route path="/Register/Director" element={<DirectorRegister/>} />
                 <Route path="/Register/Genre" element={<GenreRegister/>} />
            </Routes>
        </Router>
    )
}