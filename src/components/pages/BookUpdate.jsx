import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { cleanSearchText, firestore, setPageLocation, storage } from '../../store/firebaseSlice';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { deleteObject, ref, uploadBytes } from 'firebase/storage';
import styled from 'styled-components';
import { TailSpin } from 'react-loader-spinner';

const BookUpdate = () => {
    document.title = 'BookiFy - Listing';
    const { login, userName, userEmail, userId, userPhotoURL } = useSelector((state) => state.firebaseApp);
    const [formData, setFormData] = useState({ name: '', price: '', isbnNumber: '', coverPic: '', bookPdf: '' });
    const { name, price, isbnNumber, coverPic, bookPdf } = formData;
    const [loading, setLoading] = useState(false);
    const [Book, setBook] = useState();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { BookId } = useParams();

    //! if user Logged Out..
    useEffect(() => {
        if (!login) navigate('/login');
    }, [navigate, login]);

    useEffect(() => {
        dispatch(cleanSearchText());
        dispatch(setPageLocation('listing-Page'));
    }, [dispatch]);

    //! get Book details by bookId.....
    const getBookDetails = async () => {
        const book = await getDoc(doc(firestore, 'books', BookId));
        setBook(book.data());
        const Book = book.data();
        setFormData({ ...formData, name: Book.name, price: Book.price, isbnNumber: Book.isbnNumber });
    };
    useEffect(() => {
        getBookDetails();
    }, [BookId]);

    //! upload Book Details....
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const uploadImageResult = await uploadBytes(ref(storage, `uploads/images/${Date.now()}-${coverPic.name}`), coverPic);
        const uploadPdfResult = await uploadBytes(ref(storage, `uploads/pdf/${Date.now()}-${bookPdf.name}`), bookPdf);
        await deleteObject(ref(storage, Book.imageURL));
        await deleteObject(ref(storage, Book.pdfURL));
        await updateDoc(doc(firestore, 'books', BookId), {
            userName,
            name,
            price,
            isbnNumber,
            imageURL: uploadImageResult.ref._location.path_,
            pdfURL: uploadPdfResult.ref._location.path_,
            userId,
            userEmail,
            userPhotoURL,
        });

        //! reset Form
        setFormData({ name: '', price: '', isbnNumber: '', coverPic: '', bookPdf: '' });
        setLoading(false);
        navigate(`/book/details/${BookId}`);
        console.log('submit');
    };

    if (login) {
        return (
            <Wrapper>
                <div className='container list-Container'>
                    <form className='w-50 m-auto' onSubmit={handleSubmit}>
                        <h4>Update Your Book</h4>
                        <div className='mb-3'>
                            <label className='form-label'>Enter Book Name</label>
                            <input
                                required
                                type='text'
                                className='form-control'
                                name='name'
                                value={formData?.name}
                                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                autoComplete='off'
                                placeholder='Book name'
                            />
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>ISBN</label>
                            <input
                                required
                                type='number'
                                className='form-control'
                                name='isbnNumber'
                                value={formData?.isbnNumber}
                                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                autoComplete='off'
                                placeholder='ISBN Number'
                            />
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Price</label>
                            <input
                                required
                                type='number'
                                className='form-control'
                                name='price'
                                value={formData?.price}
                                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                autoComplete='off'
                                placeholder='Enter Price'
                            />
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Books Cover Image</label>
                            <input
                                required
                                type='file'
                                className='form-control'
                                name='coverPic'
                                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.files[0] })}
                                autoComplete='off'
                            />
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Book File (pdf)</label>
                            <input
                                required
                                type='file'
                                className='form-control'
                                name='bookPdf'
                                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.files[0] })}
                                autoComplete='off'
                            />
                        </div>
                        <button type='submit' className='btn btn-success list-btn'>
                            {loading ? (
                                <TailSpin
                                    height='20'
                                    width='80'
                                    color='#ffffff'
                                    ariaLabel='tail-spin-loading'
                                    radius='1'
                                    wrapperStyle={{}}
                                    wrapperClass=''
                                    visible={true}
                                />
                            ) : (
                                'Update'
                            )}
                        </button>
                    </form>
                </div>
            </Wrapper>
        );
    }
};

const Wrapper = styled.section`
    height: 92.9vh;
    background-color: #12162b;
    display: flex;
    align-items: center;

    .list-Container {
        background-color: #fff;
        padding: 4rem 0;
        border-radius: 1rem;
    }

    .list-Container h4 {
        width: 300px;
        margin: 0 auto 3rem;
        text-align: center;
        border-radius: 5px;
        background-color: #fd0000;
        color: white;
        padding: 0.5rem 1rem;
    }

    .list-Container input {
        border-radius: 3px;
        padding: 0.5rem;
    }

    @media screen and (max-width: 550px) {
        height: 80vh;
        background-color: #ffffff;

        .list-Container {
            padding: 0;
            margin-top: 5.5rem;
        }

        .list-Container h4 {
            font-size: 0.8rem;
            margin: 0 auto 1rem;
        }

        .list-Container label {
            font-size: 0.8rem;
        }

        .list-Container input {
            font-size: 0.8rem;
        }
    }
`;

export default BookUpdate;
