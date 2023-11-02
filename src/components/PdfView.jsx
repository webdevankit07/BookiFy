import styled from 'styled-components';

const PdfView = ({ pdfURL, setPdfShow }) => {
    console.log(pdfURL);
    return (
        <Wrapper>
            <div className='pdfSection' onClick={() => setPdfShow((prev) => !prev)}>
                <div className='pdfContainer'>
                    <embed src={pdfURL} type='application/pdf' className='pdf' />
                </div>
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.section`
    .pdfSection {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: black;
        cursor: pointer;
        z-index: 999;
    }

    .pdfContainer {
        position: relative;
        top: 2rem;
        width: 100%;
        max-width: 80vw;
        height: 90vh;
    }

    .pdf {
        width: 100%;
        height: 100%;
    }
`;

export default PdfView;
