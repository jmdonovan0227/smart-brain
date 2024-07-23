import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import SignInForm from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';
import ErrorPage from './components/ErrorPage/ErrorPage';
import Home from './components/Home/Home';
import ParticlesBg from 'particles-bg'
import './App.css';


const initialState = {
  input: '',
  imageUrl: '',
  boxes: {boxesArray: []},
  allCelebrities: {celebrityNamesArray: []},
  route: 'signin',
  isSignedIn: false,
  errorStatus: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
};

class App extends Component {
  // define state
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }});
  }

  calculateFaceLocation = (data) => {
    const regions = data.outputs[0].data.regions;

    if(regions) {
      const image = document.querySelector('#input-image');

      const width = Number(image.width);
      const height = Number(image.height);
      let allBoxes = {
        boxesArray: []
      };
  
      regions.forEach(region => {
        const boundingBox = region.region_info.bounding_box;
        allBoxes.boxesArray.push({
          leftCol: boundingBox.left_col * width,
          topRow: boundingBox.top_row * height,
          rightCol: width - (boundingBox.right_col * width),
          bottomRow: height - (boundingBox.bottom_row * height)
        });
      });

      return allBoxes;
    }

    else {
      return null;
    }
  };

  findCelebrities = (data) => {
    const regions = data.outputs[0].data.regions;

    if(regions) {
      let celebrities = {
        celebrityNamesArray: []
      };
  
      regions.forEach(region => {
        const mostLikelyCelebrityName = region.data.concepts[0].name;
        celebrities.celebrityNamesArray.push(mostLikelyCelebrityName);
      });
  
      return celebrities;
    }
    else {
      return null;
    }
  }

  updateCelebritiesState = (data) => {
    this.setState({allCelebrities: data});
  }

  displayFaceBox = (boxes) => {
    this.setState({boxes: boxes});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({errorStatus: false});
    this.setState({imageUrl: this.state.input});
    this.setState({allCelebrities: {celebrityNamesArray: []}});
    this.setState({ boxes: {boxesArray: []}});

    fetch('https://smart-brain-7iex.onrender.com/api/faceurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
      }).then(response => response.json())
      .then(result => {
        // if we found faces
        if(result.faceData.outputs[0].data.regions) {
          // draw the face borders around each face
          this.displayFaceBox(this.calculateFaceLocation(result.faceData));
          // pass the celebrity face names if we found any
          this.updateCelebritiesState(this.findCelebrities(result.celebrityFaceNames));
          // we at least have a valid image, so update count for user indicating they have put in a valid image
          // this should update the database and return the update count
          fetch('https://smart-brain-7iex.onrender.com/api/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count =>  {
            // after updating the database, update the current count on the frontend so we can display on the page
            this.setState(Object.assign(this.state.user, { entries: count }));
          })
          .catch(err => console.log('Unable to update count'));
        }

        else {
          // set an error message if we encounter an issue
          this.setState({errorStatus: true});
        }
      })
      .catch(error => console.log('error', error));
  }

  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState(initialState);
    }
    else if(route === 'home') {
      this.setState({isSignedIn: true});
    }

    this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageUrl, route, boxes } = this.state;
    return (
      <div className='app'>
        <BrowserRouter>
          <ParticlesBg type="circle" bg={true} />
          <Routes>
            <Route path="/" element={<Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>}>
              <Route index element={(route === 'signin' || route === 'signout') ? <SignInForm loadUser={this.loadUser} onRouteChange={this.onRouteChange} /> : (
                route === 'home' ? <Home 
                    name={this.state.user.name} 
                    entries={this.state.user.entries}
                    errorStatus={this.state.errorStatus} 
                    celebrities={this.state.allCelebrities} 
                    onInputChange={this.onInputChange} 
                    onButtonSubmit={this.onButtonSubmit}
                    boxes={boxes} 
                    imageUrl={imageUrl}
                  /> : (
                  route === 'register' ? <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} /> : null
                )
              )}/>
              
              <Route path="forgot_password" element={<ForgotPassword/>}/>
              <Route path="reset_password" element={<ResetPassword/>}/>
              <Route path="*" element={<ErrorPage/>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
