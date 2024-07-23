import React from 'react';
import Logo from '../Logo/Logo.js';
import FaceRecognition from '../FaceRecognition/FaceRecognition.js';
import ImageLinkForm from '../ImageLinkForm/ImageLinkForm.js';
import Rank from '../Rank/Rank.js';

const Home = props =>  {
    return (
        <div>
            <Logo />
            <Rank name={props.name} entries={props.entries}/>
            <ImageLinkForm errorStatus={props.errorStatus} celebrities={props.celebrities} onInputChange={props.onInputChange} onButtonSubmit={props.onButtonSubmit}/>
            <FaceRecognition boxes={props.boxes} imageUrl={props.imageUrl}/>
        </div>
    );
};

export default Home;