import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import PdfView from './PdfView';
import { deleteObject, getDownloadURL, ref } from 'firebase/storage';
import { firestore, storage } from '../store/firebaseSlice';
import { useNavigate } from 'react-router-dom';
import { deleteDoc, doc } from 'firebase/firestore';
import { TailSpin } from 'react-loader-spinner';

const AdminCardTable = ({ siNo, name, price, isbnNumber, pdfURL, imageURL, BookId, getAllBooks }) => {
    const [pdfShow, setPdfShow] = useState(false);
    const [pdfUrl, setPdfUrl] = useState();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const getPdfUrl = async () => {
        const pdfUrl = await getDownloadURL(ref(storage, pdfURL));
        setPdfUrl(pdfUrl);
    };
    useEffect(() => {
        getPdfUrl();
    }, [pdfURL, pdfUrl]);

    //! delete this document from fireStore...
    const deleteDocument = async () => {
        setLoading(true);
        const docRef = doc(firestore, 'books', BookId);
        await deleteDoc(docRef);
        await deleteObject(ref(storage, imageURL));
        await deleteObject(ref(storage, pdfURL));
        setLoading(false);

        //! get all books for rendering...
        getAllBooks();
    };

    return (
        <>
            <tr>
                <td>{siNo}</td>
                <td>{name}</td>
                <td>{isbnNumber}</td>
                <td>{price}Rs.</td>
                <td>
                    <button className='btn btn-primary admin-btn' onClick={() => setPdfShow((prev) => !prev)}>
                        View
                    </button>
                </td>
                <td>
                    <button className='btn btn-success admin-btn' onClick={() => navigate(`/book/details/update/${BookId}`)}>
                        Update
                    </button>
                </td>
                <td>
                    <button className='btn btn-danger admin-btn' onClick={deleteDocument}>
                        {loading ? (
                            <TailSpin height='20' width={'60'} color='#ffffff' ariaLabel='tail-spin-loading' radius='1' visible={true} />
                        ) : (
                            'Delete'
                        )}
                    </button>
                </td>
            </tr>
            {pdfShow && <PdfView pdfURL={pdfUrl} setPdfShow={setPdfShow} />}
        </>
    );
};

AdminCardTable.propTypes = {
    siNo: PropTypes.number,
    name: PropTypes.string,
    price: PropTypes.string,
    isbnNumber: PropTypes.string,
    pdfURL: PropTypes.string,
    imageURL: PropTypes.string,
    BookId: PropTypes.string,
    getAllBooks: PropTypes.func,
};

export default AdminCardTable;
