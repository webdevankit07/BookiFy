import PropTypes from 'prop-types';

const OrderCard = ({ name, qty, imageURL, userName, userEmail, userPhotoURL, price, ownerName }) => {
    return (
        <>
            <div className='card order_card'>
                <div className='p-2 d-flex align-items-center rounded-2'>
                    <img src={imageURL} className='card-img-top orderCardPoster rounded' style={{ width: '400px', height: '250px' }} />
                </div>
                <div className='card-body orderCardPoster order_card-body'>
                    <div style={{ margin: '20px 0' }}>
                        <p className='card-title'>
                            Book Owner: {ownerName}{' '}
                            <img src={userPhotoURL} style={{ height: '30px', borderRadius: '50%', margin: '0 10px' }} className='ownerImg' />
                        </p>
                        <p className='card-title'>Book Name: {name}</p>
                        <p className='card-title'>Name: {userName}</p>
                        <p className='card-title'>Email: {userEmail}</p>
                        <p className='card-title'>Qty: {qty}</p>
                        <p className='card-text' style={{ height: '0' }}>
                            This Book has a tittle <span>{`"${name}"`}</span> and its sold by <span>{`"${userName}"`}</span> and this books costs Rs.{' '}
                            <span>{price}</span>
                        </p>
                    </div>
                </div>
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
