import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { firestore, storage } from '../../store/firebaseSlice';
import { getDownloadURL, ref } from 'firebase/storage';
import Loadingimg from '../../assets/DetailLoadingImg.png';
import { useSelector } from 'react-redux';

const DetailsPage = () => {
    document.title = 'BookiFy - Book Details';
    const { login, userName, userEmail, userId } = useSelector((state) => state.firebaseApp);
    const [book, setBook] = useState(null);
    const [qty, setQty] = useState(1);
    const [imgUrl, setImgUrl] = useState(null);
    const [imgLoading, setImgLoading] = useState(false);
    const { BookId } = useParams();
    const navigate = useNavigate();

    if (!login) navigate('/login');

    const getBookById = async () => {
        const book = await getDoc(doc(firestore, 'books', BookId));
        setBook(book.data());
    };

    useEffect(() => {
        getBookById();
    }, []);

    const getImageUrl = async () => {
        setImgLoading(true);
        const imgUrl = await getDownloadURL(ref(storage, book.imageURL));
        setImgUrl(imgUrl);
        setImgLoading(false);
    };
    useEffect(() => {
        book && getImageUrl();
    }, [book]);

    const placeOrder = async () => {
        if (qty > 0) {
            await addDoc(collection(firestore, 'books', BookId, 'orders'), {
                userName,
                userId,
                userEmail,
                userPhotoURL: book.userPhotoURL,
                name: book.name,
                ownerName: book.userName,
                imageURL: imgUrl,
                qty: Number(qty),
                Price: book.price,
            });
            setQty('');
            navigate('/book/mybooks');
        }
    };

    // ! loading...
    if (book === null) {
        return (
            <h1
                style={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '3.5rem', color: '#777777' }}
                className='books_not_found'
            >
                Details Loading...
            </h1>
        );
    }

    return (
        <div className='container detailSection my-4'>
            <h1 style={{ textTransform: 'uppercase', textAlign: 'center' }}>{book.name}</h1>
            <div className='my-3'>
                {imgLoading === true ? (
                    <img src={Loadingimg} style={{ width: '100%', height: '600px' }} className='card-img-top detailPoster rounded-3' />
                ) : (
                    <img src={imgUrl} style={{ width: '100%', height: '600px' }} className='card-img-top detailPoster rounded' />
                )}
            </div>
            <h2 className='my-2'>Details</h2>
            <p className='mx-5'>Name: {book.name}</p>
            <p className='mx-5'>isbnNumber: {book.isbnNumber}</p>
            <p className='mx-5'>Price: Rs. {book.price}</p>
            <h2 className='my-2'>Owner Details</h2>
            <p className='mx-5'>Name: {book.userName}</p>
            <p className='mx-5'>Email: {book.userEmail}</p>
            <div className='my-3'>
                <label className='form-label lable'>Enter Qty</label>
                <input
                    required
                    type='number'
                    className='form-control w-25'
                    name='name'
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    autoComplete='off'
                    placeholder='Enter Qty'
                />
            </div>
            <button className='btn btn-success mt-3' onClick={placeOrder}>
                Buy Now
            </button>
        </div>
    );
};

export default DetailsPage;
