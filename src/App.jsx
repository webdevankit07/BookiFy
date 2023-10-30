import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth, isLoggedIn, userData } from './store/firebaseSlice';
import { useDispatch, useSelector } from 'react-redux';

//! css file
import './App.css';

//! Components...
import Navbar from './components/Navbar';

//! Pages...
import Home from './components/pages/Home';
import RegisterPage from './components/pages/RegisterPage';
import Login from './components/pages/Login';
import List from './components/pages/List';
import DetailsPage from './components/pages/DetailsPage';
import Orders from './components/pages/Orders';
import Error from './components/pages/Error';

const App = () => {
    const [islogin, setisLogin] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        onAuthStateChanged(firebaseAuth, (user) => {
            user ? setisLogin(true) : setisLogin(false);
            if (user) {
                dispatch(
                    userData({
                        name: user.displayName || user.email.charAt(0).toUpperCase() + user.email.slice(1, -10),
                        email: user.email,
                        userId: user.uid,
                        photoURL: user.photoURL,
                    })
                );
            }
        });
    }, [dispatch, islogin]);
    dispatch(isLoggedIn(islogin));

    return (
        <>
            <Router>
                <Navbar />
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/register' element={<RegisterPage />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/book/list' element={<List />} />
                    <Route path='/book/details/:BookId' element={<DetailsPage />} />
                    <Route path='/book/mybooks' element={<Orders />} />
                    <Route path='*' element={<Error />} />
                </Routes>
            </Router>
        </>
    );
};

export default App;
