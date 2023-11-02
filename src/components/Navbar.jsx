import { signOut } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { booksIDs_collections, firebaseAuth, setSearchItem, userData } from '../store/firebaseSlice';
import { BiSearch } from 'react-icons/bi';
import bookifyLogo from '../assets/books.png';
import userLogo from '../assets/user.png';

const Navbar = () => {
    const { userName, login, userPhotoURL, searchItem, pageLocation } = useSelector((state) => state.firebaseApp);
    const dispatch = useDispatch();

    //! LoggedOut Function..
    const loggedOut = async () => {
        await signOut(firebaseAuth);
        dispatch(
            userData({
                name: 'Bookify',
                email: null,
                userId: null,
                photoURL: null,
            })
        );
        dispatch(booksIDs_collections(null));
    };

    return (
        <>
            <nav className='navbar navbar-expand-lg bg-body-tertiary' style={{ position: 'sticky', top: '0', zIndex: '9999' }} data-bs-theme='dark'>
                <div className='container-fluid link'>
                    <Link to={'/'}>
                        <div className='p-2 mr-3 gap-2' style={{ display: 'flex', alignItems: 'center' }}>
                            {login ? (
                                <img src={userPhotoURL || userLogo} style={{ borderRadius: '50%', margin: '0 10px', width: '40px' }} />
                            ) : (
                                <img src={bookifyLogo} style={{ width: '40px' }} />
                            )}
                            <h1 className='text-white fs-5 mb-0 mx-2' href='#'>
                                {login ? userName || 'Bookify' : 'Bookify'}
                            </h1>
                        </div>
                    </Link>

                    <button
                        className='navbar-toggler'
                        type='button'
                        data-bs-toggle='collapse'
                        data-bs-target='#navbarSupportedContent'
                        aria-controls='navbarSupportedContent'
                        aria-expanded='false'
                        aria-label='Toggle navigation'
                    >
                        <span className='navbar-toggler-icon'></span>
                    </button>
                    <div className='collapse navbar-collapse' id='navbarSupportedContent'>
                        <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
                            {login && (
                                <>
                                    <li className='nav-item mx-3'>
                                        <Link className='nav-link ' aria-current='page' to='/'>
                                            Home
                                        </Link>
                                    </li>
                                    <li className='nav-item mx-3'>
                                        <Link className='nav-link ' aria-current='page' to={'/book/list'}>
                                            Add Listing
                                        </Link>
                                    </li>
                                    <li className='nav-item mx-3'>
                                        <Link className='nav-link ' aria-current='page' to={'/book/mybooks'}>
                                            Your Books
                                        </Link>
                                    </li>
                                    <li className='nav-item admin-pannel'>
                                        <Link className='nav-link ' aria-current='page' to={'/adminPannel'}>
                                            Admin Pannel
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                        <div className='action-section d-flex align-items-center gap-5'>
                            {(pageLocation === 'home-Page' || pageLocation === 'order-Page') && (
                                <div className='searchSection'>
                                    <input
                                        type='text'
                                        className='searchInput'
                                        value={searchItem}
                                        onChange={(e) => dispatch(setSearchItem(e.target.value))}
                                    />
                                    <div className='searchIcon'>
                                        <BiSearch />
                                    </div>
                                </div>
                            )}

                            {pageLocation !== 'login-Page' && pageLocation !== 'signUp-Page' && (
                                <div className='authSection'>
                                    <Link to={!login && '/login'}>
                                        <button type='submit' className='actionBtn' onClick={login ? loggedOut : undefined}>
                                            {login ? 'Log out' : 'Log In'}
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
