import { collection, getDocs } from 'firebase/firestore';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { cleanOrders, cleanSearchText, firestore, setOrders, setPageLocation } from '../../store/firebaseSlice';
import OrderCard from './OrderCard';

const Orders = () => {
    document.title = 'BookiFy - MyBooks';
    const { login, booksIDs, allOrders, userEmail, searchItem } = useSelector((state) => state.firebaseApp);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        !login && navigate('/login');
    }, [login, navigate]);

    //! get my orders from firestore...
    const getMyOrders = () => {
        if (booksIDs) {
            dispatch(cleanOrders());
            booksIDs.map(async (bookID) => {
                const orders = await getDocs(collection(firestore, 'books', bookID, 'orders'));
                orders.docs[0] && dispatch(setOrders(orders.docs[0]));
            });
        }
    };
    useEffect(() => {
        getMyOrders();
    }, [booksIDs, dispatch]);

    //!clear search text...
    useEffect(() => {
        dispatch(cleanSearchText());
        dispatch(setPageLocation('order-Page'));
    }, [dispatch]);

    //! ALl user orders..
    const myOrders = allOrders
        .map((order) => order.data())
        .filter((order) => order.userEmail === userEmail)
        .filter(
            (order) =>
                order.name.toLowerCase().split(' ').join('').includes(searchItem.toLowerCase().split(' ').join('')) ||
                order.name.toLowerCase().includes(searchItem.toLowerCase())
        );

    return myOrders.length === 0 ? (
        <h1 className='books_not_found'>No Books Available...</h1>
    ) : (
        <>
            <div className='container' style={{ minHeight: '90vh' }}>
                <h1 className='text-center mt-3'>My Book List</h1>
                {myOrders.map((order) => {
                    const { name, BookId, imageURL, pdfURL, userName, userEmail, userId, userPhotoURL, Price, ownerName } = order;

                    return (
                        <OrderCard
                            key={BookId}
                            name={name}
                            id={BookId}
                            getMyOrders={getMyOrders}
                            imageURL={imageURL}
                            pdfURL={pdfURL}
                            userName={userName}
                            userEmail={userEmail}
                            UserId={userId}
                            userPhotoURL={userPhotoURL}
                            price={Price}
                            ownerName={ownerName}
                        />
                    );
                })}
            </div>
        </>
    );
};

export default Orders;
