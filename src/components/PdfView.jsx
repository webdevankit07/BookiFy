import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const PdfView = ({ pdfURL, setPdfShow }) => {
    return (
        <div>
            <div className='pdfSection' onClick={() => setPdfShow((prev) => !prev)}>
                <div className='pdf'>
                    <embed src={pdfURL} type='application/pdf' className='pdfContainer' />
                </div>
            </div>
        </div>
    );
};

export default PdfView;
