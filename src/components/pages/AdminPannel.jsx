import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cleanSearchText, firestore, setPageLocation } from '../../store/firebaseSlice';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import AdminCardTable from '../AdminCardTable';

const AdminPannel = () => {
    document.title = 'BookiFy - Admin Pannel';
    const { login, searchItem, userEmail } = useSelector((state) => state.firebaseApp);
    const [books, setBooks] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        !login && navigate('/login');
    }, [login, navigate]);

    //! Retrieving listed Book Data from Firebase...
    const getAllBooks = async () => {
        const books = await getDocs(collection(firestore, 'books'));
        setBooks(books.docs);
    };
    useEffect(() => {
        getAllBooks();
        dispatch(cleanSearchText());
        dispatch(setPageLocation('home-Page'));
    }, [dispatch]);

    //!clear search text...
    useEffect(() => {
        dispatch(cleanSearchText());
        dispatch(setPageLocation('order-Page'));
    }, [dispatch]);

    //! ALl user orders..
    const myListedBooks = books
        ?.filter((book) => book.data().userEmail === userEmail)
        .filter(
            (book) =>
                book.data().name.toLowerCase().split(' ').join('').includes(searchItem.toLowerCase().split(' ').join('')) ||
                book.data().name.toLowerCase().includes(searchItem.toLowerCase())
        );

    return (
        <Wrapper>
            <div className='admin-container'>
                <div className='table-container'>
                    <div className='adminUpload'>
                        <h2>Book List</h2>
                        <button className='adminAddBook btn btn-primary' onClick={() => navigate('/book/list')}>
                            Add Book
                        </button>
                    </div>
                    <table className='admin-table'>
                        <thead>
                            <tr>
                                <th>Si.No</th>
                                <th>Name</th>
                                <th>IsbnNumber</th>
                                <th>Price</th>
                                <th>Read Book</th>
                                <th>Update Book</th>
                                <th>Delete Book</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myListedBooks?.map((book, i) => {
                                const { name, price, isbnNumber, pdfURL, imageURL } = book.data();

                                return (
                                    <AdminCardTable
                                        key={book.id}
                                        siNo={i + 1}
                                        name={name}
                                        isbnNumber={isbnNumber}
                                        price={price}
                                        pdfURL={pdfURL}
                                        imageURL={imageURL}
                                        BookId={book.id}
                                        getAllBooks={getAllBooks}
                                    />
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.section`
    background-color: #12162b;
    min-height: 92.8vh;
    padding-top: 5rem;

    .table-container {
        width: 80%;
        min-height: 700px;
        margin: auto;
        background-color: #fff;
        padding: 1rem 0.5rem;
        border-radius: 1rem;
    }

    .adminUpload {
        width: 90%;
        margin: auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 0;
    }

    .admin-table {
        margin: auto;
        width: 90%;
        background-color: #afafaf;
        overflow: hidden;
        border-radius: 5px;
        border: 2px solid black;
    }

    thead {
        background-color: #4a84db;
        color: white;
    }

    thead th {
        padding: 1rem;
        text-align: center;
    }

    tbody {
        background-color: #ffffff;
        color: black;
    }

    tbody tr {
        border-bottom: 1px solid #c8c8c8;
    }

    tbody td {
        min-width: 100px;
        padding: 0.8rem;
        text-align: center;
        color: black;
    }

    .admin-btn {
        padding: 0.5rem 2rem;
        font-size: 0.8rem;
    }
`;

export default AdminPannel;
