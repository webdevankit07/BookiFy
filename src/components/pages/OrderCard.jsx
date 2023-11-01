import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import PropTypes from 'prop-types';
import { firestore } from '../../store/firebaseSlice';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PdfView from '../PdfView';

const OrderCard = ({ name, id, imageURL, pdfURL, userName, userEmail, userPhotoURL, price, ownerName, getMyOrders }) => {
    const { userId } = useSelector((state) => state.firebaseApp);
    const [pdfShow, setPdfShow] = useState();

    //! delete my orders from firestore...
    const deleteOrder = async () => {
        //! Querry collection of order from firestore...
        const collectionRef = collection(firestore, 'books', id, 'orders');
        const q = query(collectionRef, where('userEmail', '==', userEmail));
        const querySnapshot = await getDocs(q);

        //! finding document and delete...
        querySnapshot.forEach(async (document) => {
            const docRef = doc(firestore, 'books', id, 'orders', document.id);
            await deleteDoc(docRef);
        });

        //! recole ordes..
        getMyOrders();
    };

    return (
        <>
            <div>
                <div className='card order_card'>
                    <div className='p-2 d-flex align-items-center rounded-2'>
                        <img src={imageURL} className='card-img-top orderCardPoster rounded' style={{ width: '400px', height: '250px' }} />
                    </div>
                    <div className='card-body orderCardPoster order_card-body'>
                        <div style={{ margin: '20px 0' }}>
                            <p className='card-title'>
                                Book Owner: {ownerName}{' '}
                                <img
                                    src={userPhotoURL}
                                    style={{
                                        height: '30px',
                                        borderRadius: '50%',
                                        margin: '0 10px',
                                    }}
                                    className='ownerImg'
                                />
                            </p>
                            <p className='card-title'>Book Name: {name}</p>
                            <p className='card-title'>Name: {userName}</p>
                            <p className='card-title'>Email: {userEmail}</p>
                            <p className='card-text' style={{ height: '0' }}>
                                This Book has a tittle <span>{`"${name}"`}</span> and its sold by <span>{`"${userName}"`}</span> and this books costs
                                Rs. <span>{price}</span>
                            </p>
                            <div className='mt-5'>
                                <button className='btn btn-success px-10 py-2' onClick={() => setPdfShow((prev) => !prev)}>
                                    Read
                                </button>
                                <button className='btn btn-danger mx-3 px-10 py-2' onClick={deleteOrder}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {pdfShow && <PdfView pdfURL={pdfURL} setPdfShow={setPdfShow} />}
            </div>
        </>
    );
};

OrderCard.propTypes = {
    name: PropTypes.string,
    qty: PropTypes.number,
    imageURL: PropTypes.string,
    userName: PropTypes.string,
    userEmail: PropTypes.string,
    userId: PropTypes.string,
    userPhotoURL: PropTypes.string,
    price: PropTypes.number,
    ownerName: PropTypes.string,
};

export default OrderCard;
