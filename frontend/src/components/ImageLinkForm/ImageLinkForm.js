import React, { useState, useEffect, useCallback } from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({ errorStatus, celebrities, onInputChange, onButtonSubmit }) => {
    const [text, setText] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        if(errorStatus) {
            setError(true);
        }
        else {
            setError(false);
        }
    }, [errorStatus]);

    const capitalizeWords = (string) => {
        return string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const createCelebrityString = useCallback((celebrities) => {
        if(!celebrities) {
            return '';
        }

        else if (!celebrities.celebrityNamesArray.length) {
            return '';
        }

        const str = celebrities.celebrityNamesArray.map((item, index) => {
          const capitalizedItem = capitalizeWords(item);
          if (index === celebrities.celebrityNamesArray.length - 1) {
            if (celebrities.celebrityNamesArray.length === 1) {
              return `Wow is that ${capitalizedItem}?`;
            } else {
              return `and ${capitalizedItem}?`;
            }
          } else if (index === 0) {
            return `Wow is that ${capitalizedItem}, `;
          } else {
            return `${capitalizedItem}, `;
          }
        }).join('');

        return str;
    }, []);

    useEffect(() => {
        setText(createCelebrityString(celebrities));
    }, [celebrities, createCelebrityString]);

    return (
        <div>
            <p className='center f3'>
                {'This Magic Brain will detect faces in your pictures. Give it a try!'}
            </p>

            <div className='div-style'>
                {
                    error ? <span className='span-style'>Sorry, I wasn't able to detect any faces...</span>
                    : <span className='span-style'>{text}</span>
                }
            </div>

            <div className='center'>
                <div className='form center pa4 br3 shadow-5'>
                    <input className='f4 pa2 w-70 center' type='text' onChange={onInputChange}/>
                    <button className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple b--light-purple' onClick={onButtonSubmit}>Detect</button>
                </div>
            </div>
        </div>
    )
}

export default ImageLinkForm;