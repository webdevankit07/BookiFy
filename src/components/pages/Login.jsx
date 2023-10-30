import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signInUserWithEmailPassword, signInWithGoogle } from '../../store/firebaseSlice';
import { Link, useNavigate } from 'react-router-dom';
import bgImg from '../../assets/bg_bookify.jpg';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
    document.title = 'BookiFy - Login Page';
    const { login } = useSelector((state) => state.firebaseApp);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (login) navigate('/');
    }, [login, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(signInUserWithEmailPassword({ email, password }));
        setEmail('');
        setPassword('');
    };

    const googleClick = () => {
        dispatch(signInWithGoogle());
    };

    if (!login) {
        return (
            <>
                <section className='signUp-section'>
                    <div className='register'>
                        <div className='input-section'>
                            <h2>Sign In</h2>

                            <form id='form' className='flex flex-col' onSubmit={handleSubmit}>
                                <label>Email address</label>
                                <input
                                    type='email'
                                    className='form-control'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder='you@example.com'
                                />
                                <label>Password</label>
                                <input
                                    type='password'
                                    className='form-control'
                                    value={password}
                                    placeholder='Enter Your Password'
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <div className='flex p-2'>
                                    <span>Doesn't have account yet?</span>
                                    <Link to={'/register'}>Sign UP</Link>
                                </div>
                                <button className='btn'>Log In</button>
                                <div className='with-google'>
                                    <hr />
                                    <div className='with-google-login'>or Login with</div>
                                </div>
                                <button className='google-btn' onClick={googleClick}>
                                    <FcGoogle />
                                    <span>Google</span>
                                </button>
                            </form>
                        </div>
                        <img src={bgImg} />
                    </div>
                </section>
            </>
        );
    }
};

export default Login;
