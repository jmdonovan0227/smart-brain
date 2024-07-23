import React, { useState, useEffect } from 'react';
import './FaceRecognition.css';

// setting height to auto will automatically adjust the height based on width to keep picture at a fixed size
// but not make the image look squished
const FaceRecognition = ({ imageUrl, boxes }) => {
    const [isImageLoading, setIsImageLoading] = useState(true);

    useEffect(() => {
        setIsImageLoading(true);
    }, [imageUrl]);

    const handleImageLoad = () => {
        setIsImageLoading(false);
    }

    return (
        <div className='center ma'>
            <div className='absolute mt2'>
                <img onLoad={handleImageLoad} id='input-image' alt='' src={imageUrl} width='500px' height='auto' style={{ visibility: isImageLoading ? 'hidden' : 'visible'}}/>
                { !isImageLoading ?
                    boxes.boxesArray.map((box, idx) => (
                        <div key={idx} className='bounding-box' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
                    ))
                    : <div></div>
                }
            </div>
        </div>
    );
};

export default FaceRecognition;