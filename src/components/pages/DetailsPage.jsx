import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { firestore, setPageLocation, storage } from '../../store/firebaseSlice';
import { getDownloadURL, ref } from 'firebase/storage';
import Loadingimg from '../../assets/DetailLoadingImg.png';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

const DetailsPage = () => {
    document.title = 'BookiFy - Book Details';
    const { login, userName, userEmail, userId } = useSelector((state) => state.firebaseApp);
    const [book, setBook] = useState(null);
    const [imgUrl, setImgUrl] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [imgLoading, setImgLoading] = useState(false);
    const { BookId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //! we are not Logged in...
    if (!login) navigate('/login');

    //! get Book details by bookId.....
    const getBookById = async () => {
        const book = await getDoc(doc(firestore, 'books', BookId));
        setBook(book.data());
    };
    useEffect(() => {
        getBookById();
        dispatch(setPageLocation('details-Page'));
    }, [dispatch]);

    //! get full ImageUrl by image url of book....
    const getImageUrl = async () => {
        setImgLoading(true);
        const imgUrl = await getDownloadURL(ref(storage, book.imageURL));
        const pdfUrl = await getDownloadURL(ref(storage, book.pdfURL));
        setImgUrl(imgUrl);
        setPdfUrl(pdfUrl);
        setImgLoading(false);
    };
    useEffect(() => {
        book && getImageUrl();
    }, [book]);

    //! Place Order....
    const placeOrder = async () => {
        await addDoc(collection(firestore, 'books', BookId, 'orders'), {
            userName,
            userId,
            BookId,
            userEmail,
            userPhotoURL: book.userPhotoURL,
            name: book.name,
            ownerName: book.userName,
            imageURL: imgUrl,
            pdfURL: pdfUrl,
            Price: book.price,
        });
        navigate('/book/mybooks');
    };

    // ! loading...
    if (book === null) {
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
                Details Loading...
            </h1>
        );
    }

    return (
        <Wrapper>
            <div className='container detailSection my-4'>
                <h1 style={{ textTransform: 'uppercase', textAlign: 'center' }}>{book.name}</h1>
                <div className='my-3 detailPoster-container'>
                    {imgLoading === true ? (
                        <img src={Loadingimg} className='card-img-top detailPoster rounded-3' />
                    ) : (
                        <img src={imgUrl} className='card-img-top detailPoster rounded' />
                    )}
                </div>
                <div className='detail-container'>
                    <div>
                        <h2 className='my-2'>Details</h2>
                        <p>Name: {book.name}</p>
                        <p>isbnNumber: {book.isbnNumber}</p>
                        <p>Price: Rs. {book.price}</p>
                    </div>
                    <div>
                        <h2 className='my-2'>Owner Details</h2>
                        <p>Name: {book.userName}</p>
                        <p>Email: {book.userEmail}</p>
                    </div>
                </div>
                <button className='btn btn-success mt-3' onClick={placeOrder}>
                    Add to Read
                </button>
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.section`
    .detailPoster-container {
        width: 85%;
        margin: auto;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 3px 5px rgba(0, 0, 0, 0.23);
        border-radius: 1rem;
        overflow: hidden;
    }

    .detailPoster {
        height: 55vh;
    }

    .detail-container {
        margin: 2rem 5rem;
        display: flex;
        gap: 10rem;
    }

    .detail-container h2 {
        font-weight: bold;
    }

    .detail-container p {
        margin-bottom: 0.4rem;
        margin-left: 2rem;
        color: rgb(100, 100, 100);
    }

    .detailSection label {
        font-weight: bold;
    }

    .detailSection input {
        width: 300px !important;
    }

    .detailSection button {
        width: 80%;
        display: block;
        margin: auto;
    }

    @media screen and (max-width: 500px) {
        .detailPoster {
            width: 100% !important;
            height: 250px !important;
        }

        .detailPoster-container {
            width: 100%;
        }

        .detail-container {
            margin: 1rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .detail-container h2 {
            font-size: 0.8rem;
        }

        .detail-container p {
            font-size: 0.7rem;
            margin-left: 1rem;
        }

        .detailSection > button {
            width: 200px;
            padding: 0.5rem;
            font-size: 0.8rem;
        }

        .detailSection > button {
            margin-left: 1rem;
        }
    }
`;

export default DetailsPage;
