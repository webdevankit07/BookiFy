import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { cleanSearchText, firestore, setPageLocation, storage } from '../../store/firebaseSlice';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';

const List = () => {
    document.title = 'BookiFy - Listing';
    const { login, userName, userEmail, userId, userPhotoURL } = useSelector((state) => state.firebaseApp);
    const [formData, setFormData] = useState({ name: '', price: '', isbnNumber: '', coverPic: '', bookPdf: '' });
    const { name, price, isbnNumber, coverPic, bookPdf } = formData;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //! if user Logged Out..
    useEffect(() => {
        if (!login) navigate('/login');
    }, [navigate, login]);

    useEffect(() => {
        dispatch(cleanSearchText());
        dispatch(setPageLocation('listing-Page'));
    }, []);

    const setData = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const uploadImageResult = await uploadBytes(ref(storage, `uploads/images/${Date.now()}-${coverPic.name}`), coverPic);
        const uploadPdfResult = await uploadBytes(ref(storage, `uploads/pdf/${Date.now()}-${bookPdf.name}`), bookPdf);
        // console.log(uploadImageResult, uploadPdfResult);
        await addDoc(collection(firestore, 'books'), {
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
        navigate('/');
        console.log('submit');
    };

    if (login) {
        return (
            <>
                <div className='container mt-5'>
                    <form className='w-50 m-auto' onSubmit={handleSubmit}>
                        <div className='mb-3'>
                            <label className='form-label'>Enter Book Name</label>
                            <input
                                type='text'
                                className='form-control'
                                name='name'
                                value={formData.name}
                                onChange={setData}
                                autoComplete='off'
                                placeholder='Book name'
                            />
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>ISBN</label>
                            <input
                                type='number'
                                className='form-control'
                                name='isbnNumber'
                                value={formData.isbnNumber}
                                onChange={setData}
                                autoComplete='off'
                                placeholder='ISBN Number'
                            />
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Price</label>
                            <input
                                type='number'
                                className='form-control'
                                name='price'
                                value={formData.price}
                                onChange={setData}
                                autoComplete='off'
                                placeholder='Enter Price'
                            />
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Books Cover Image</label>
                            <input
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
                                type='file'
                                className='form-control'
                                name='bookPdf'
                                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.files[0] })}
                                autoComplete='off'
                            />
                        </div>
                        <button type='submit' className='btn btn-primary'>
                            Create
                        </button>
                    </form>
                </div>
            </>
        );
    }
};

export default List;
