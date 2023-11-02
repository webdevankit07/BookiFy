import styled from 'styled-components';

const Footer = () => {
    return <Wrapper>{new Date().getFullYear()} &copy; Copyighted - BookiFy</Wrapper>;
};

const Wrapper = styled.section`
    width: 100%;
    background-color: #000000;
    color: white;
    padding: 1.5rem;
    text-align: center;
`;

export default Footer;
