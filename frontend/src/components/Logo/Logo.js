import React from 'react';
import Tilt from 'react-parallax-tilt';
import Brain from './brain.png';
import './Logo.css';

const Logo = () => {
    return (
        <div className='ma4 mt0'>
            <Tilt className='Tilt br2 shadow-2' style={{ height: '150px', width: '150px', backgroundColor: 'darkgreen', max: 55}}>
                <div className='Tilt-inner pa4'><img style={{paddingTop: '2px'}} alt='brain icon' src={Brain}/></div>
            </Tilt>
        </div>
    );
}

export default Logo;