import { booksIDs_collections, cleanSearchText, firestore } from '../../store/firebaseSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { collection, getDocs } from 'firebase/firestore';
import Card from '../Card';

const Home = () => {
    document.title = 'BookiFy - Home';
    const { login, searchItem } = useSelector((state) => state.firebaseApp);
    const [books, setBooks] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // //! Checking User Login or Not...
    // useEffect(() => {
    //     if (!login) navigate('/login');
    // }, [dispatch, login, navigate]);

    //! Retrieving listed Book Data from Firebase...
    const listOfAllBooks = async () => {
        const books = await getDocs(collection(firestore, 'books'));
        setBooks(books.docs);
        dispatch(cleanSearchText());
    };
    useEffect(() => {
        listOfAllBooks();
    }, []);

    //! register all booksIDs in GlobleState..
    useEffect(() => {
        if (books) {
            const booksIDs = books.map((books) => books.id);
            dispatch(booksIDs_collections(booksIDs));
        }
    }, [dispatch, books, login]);

    // ! If books is null..
    if (books === null)
        return (
            <h1
                style={{
                    height: '80vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '3.5rem',
                    color: '#777777',
                }}
                className='books_not_found'
            >
                books Loading...
            </h1>
        );

    //! If User has not Listed any books...
    if (books && books.length === 0) return <h1 className='books_not_found'>Books Not Listed...</h1>;

    return (
        books && (
            <>
                <div className='container my-5 card-container home-page'>
                    {books.map((book) => {
                        return (
                            (book.data().name.toLowerCase().split(' ').join('').includes(searchItem.toLowerCase().split(' ').join('')) ||
                                book.data().name.toLowerCase().includes(searchItem.toLowerCase())) && (
                                <div key={book.id}>
                                    <Card id={book.id} book={{ ...book.data() }} />
                                </div>
                            )
                        );
                    })}
                </div>
            </>
        )
    );
};

export default Home;
