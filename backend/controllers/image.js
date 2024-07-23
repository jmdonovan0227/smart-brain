import fetch from 'node-fetch';

export const handleFaceApiCall = async (req, res, db) => {
    const returnClarifaiRequestOptions = (imageUrl) => {
        const PAT = process.env.CLARIFAI_APP_PAT;
        const USER_ID = process.env.CLARIFAI_USER_ID;
        const APP_ID = process.env.CLARIFAI_APP_ID;
        const IMAGE_URL = imageUrl;
      
        const raw = JSON.stringify({
          "user_app_id": {
              "user_id": USER_ID,
              "app_id": APP_ID
          },
          "inputs": [
              {
                  "data": {
                      "image": {
                          "url": IMAGE_URL
                          // "base64": IMAGE_BYTES_STRING
                      }
                  }
              }
          ]
        });
      
        return {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Authorization': 'Key ' + PAT
          },
          body: raw
        };
      };

      const requestOptions = returnClarifaiRequestOptions(req.body.input);

      try {
        const faceDetectionPromise = fetch("https://api.clarifai.com/v2/models/face-detection/outputs", requestOptions);
        const celebrityFaceDetectionPromise = fetch("https://api.clarifai.com/v2/models/celebrity-face-detection/outputs", requestOptions);

        const [faceDetectionResponse, celebrityFaceDetectionResponse ] = await Promise.all([
            faceDetectionPromise, celebrityFaceDetectionPromise.catch(error => {
                return null;
            }) 
        ]);

        if(!faceDetectionResponse.ok) {
            res.status(400).json('could not detect any faces');
        }

        const faceData = await faceDetectionResponse.json();
        const celebrityFaceNames = celebrityFaceDetectionResponse ? await celebrityFaceDetectionResponse.json() : null;
        res.json({faceData, celebrityFaceNames});
    } catch(err) {
        res.status(400).json('we encountered an error when calling apis');
    }
};


export const handleImageGet = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('Unable to get entries'));
};