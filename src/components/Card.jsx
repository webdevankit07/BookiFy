import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { storage } from '../store/firebaseSlice';
import { getDownloadURL, ref } from 'firebase/storage';
import LoadingImg from '../assets/Loadingimg.png';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Card = ({ id, book }) => {
    const { login } = useSelector((state) => state.firebaseApp);
    const { name, imageURL, price, userName } = book;
    const [url, setUrl] = useState(null);
    const [imgLoading, setImgLoading] = useState(false);

    //! get ImageUrl.....
    const getImagetUrl = async () => {
        setImgLoading(true);
        const imgUrl = await getDownloadURL(ref(storage, imageURL));
        setUrl(imgUrl);
        setImgLoading(false);
    };
    useEffect(() => {
        getImagetUrl();
    }, []);

    return (
        <div>
            <div className='card'>
                <div className='p-1'>
                    {imgLoading ? <img src={LoadingImg} className='card-img-top rounded' /> : <img src={url} className='card-img-top rounded' />}
                </div>
                <div className='card-body'>
                    <h5 className='card-title'>{name}</h5>
                    <p className='card-text'>
                        This Book has a tittle <span>{`"${name}"`}</span> and its sold by <span>{`"${userName}"`}</span> and this books costs{' '}
                        <span>Rs.{price}</span>
                    </p>
                    <Link to={login ? `/book/details/${id}` : '/login'} className='btn btn-primary'>
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

Card.propTypes = {
    id: PropTypes.string,
    book: PropTypes.object.isRequired,
    imageURL: PropTypes.string,
    name: PropTypes.string,
    userEmail: PropTypes.string,
    price: PropTypes.number,
};

export default Card;
