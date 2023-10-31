import { useDispatch } from 'react-redux';
import { setPageLocation, signInWithGoogle, signUpUserWithEmailPassword } from '../../store/firebaseSlice';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import bgImg from '../../assets/bg_bookify.jpg';
import { FcGoogle } from 'react-icons/fc';

const RegisterPage = () => {
    document.title = 'BookiFy - Register Page';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setPageLocation('signUp-Page'));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(signUpUserWithEmailPassword({ email, password }));
        setEmail('');
        setPassword('');
        navigate('/login');
    };

    const googleClick = () => {
        dispatch(signInWithGoogle());
    };

    return (
        <>
            <section className='signUp-section'>
                <div className='register'>
                    <div className='input-section'>
                        <h2>Sign Up</h2>

                        <form id='form' className='flex flex-col' onSubmit={handleSubmit}>
                            <label htmlFor='email'>Email address</label>
                            <input type='email' id='email' className='form-control' value={email} onChange={(e) => setEmail(e.target.value)} />
                            <label htmlFor='password'>Password</label>
                            <input
                                type='password'
                                id='password'
                                className='form-control'
                                value={password}
                                placeholder='Enter Your Password'
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div className='flex p-2'>
                                <span>Already have a account</span>
                                <Link to={'/login'}>Sign in</Link>
                            </div>
                            <button type='submit' className='btn'>
                                Sign Up
                            </button>
                            <div className='with-google'>
                                <hr />
                                <div className='with-google-login'>or SignUp with</div>
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
};

export default RegisterPage;
