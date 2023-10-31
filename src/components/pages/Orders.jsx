import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { cleanOrders, cleanSearchText, firestore, setOrders, setPageLocation } from '../../store/firebaseSlice';
import OrderCard from './OrderCard';

const Orders = () => {
    const { login, booksIDs, allOrders, userId, searchItem } = useSelector((state) => state.firebaseApp);
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
    }, []);

    //! ALl user orders..
    const myOrders = allOrders
        .map((order) => order.data())
        .filter((order) => order.userId === userId)
        .filter(
            (order) =>
                order.name.toLowerCase().split(' ').join('').includes(searchItem.toLowerCase().split(' ').join('')) ||
                order.name.toLowerCase().includes(searchItem.toLowerCase())
        );

    return myOrders.length === 0 ? (
        <h1 className='books_not_found'>No Books Available...</h1>
    ) : (
        <>
            <div className='container'>
                <h1 className='text-center mt-3'>My Book List</h1>
                {myOrders.map((order) => {
                    const { name, BookId, imageURL, userName, userEmail, userId, userPhotoURL, Price, ownerName } = order;

                    return (
                        <div key={BookId}>
                            <OrderCard
                                name={name}
                                id={BookId}
                                getMyOrders={getMyOrders}
                                // qty={qty}
                                imageURL={imageURL}
                                userName={userName}
                                userEmail={userEmail}
                                UserId={userId}
                                userPhotoURL={userPhotoURL}
                                price={Price}
                                ownerName={ownerName}
                            />
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default Orders;
