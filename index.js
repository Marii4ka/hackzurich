import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  asset,
  Environment,
  Pano,
  Model,
  AmbientLight,
} from 'react-360';
import EventEmitter from "EventEmitter";
import MediaAppTemplateScenePage from "MediaAppTemplateScenePage.react";
import MediaAppTemplateSubtitleText from "MediaAppTemplateSubtitleText.react";

import TopPosts from './TopPosts';
import CurrentPost from './CurrentPost';
import ModelView from './ModelView';
import * as Store from './Store';
Store.initialize('AIzaSyAVUaHZ78RArYYuHnaQMhRUEZ8hkTDL6OU');


//import Button from './button.js';


// The mock database
const SCENE_DEF = [
  {
    type: 'photo',
    title: 'Welcome to Antarctica',
    source: asset('antarctica.jpg'),
    audio: asset('penguin.wav'),
    next: 1,
  //  subtitle: 'Welcome to Penguin World!',
  },
  {
    type: 'video',
    title: ' ',
    source: {url: asset('video360.mp4').uri},
    next: 2,
  //  subtitle: 'This is a 360 street view, you can see the traffic.',
  },

/*  {
    type: 'photo',
    title: 'Welcome Scene',
    source: asset('360_world.jpg'),
    screen: asset('1.png'),
    audio: asset('penguin.wav'),
    next: 3,
    subtitle: 'Welcome to Penguin World!',
  },
/*  {
    type: 'photo',
    title: 'Welcome Scene',
    source: asset('360_world.jpg'),
    screen: {url: asset('2.png').uri},
    audio: asset('penguin.wav'),
    next: 4,
    subtitle: 'Welcome to Penguin World!',
  },
  {
    type: 'photo',
    title: 'Welcome Scene',
    source: asset('360_world.jpg'),
    screen: {url: asset('3.png').uri},
    audio: asset('penguin.wav'),
    next: 5,
    subtitle: 'Welcome to Penguin World!',
  },*/
  {
    type: 'photo',
    title: ' ',
    source: asset('360_world.jpg'),
    screen: {url: asset('video.mp4').uri},
    next: 3,
    //subtitle: 'This is a 2d video of street view, you can see the traffic.',
  },
  {
    type: 'photo',
    title: ' ',
    source: asset('360_world.jpg'),
    screen: {url: asset('waste.mp4').uri},
    next: 0,
  //  subtitle: 'This is a 2d video of street view, you can see the traffic.',
  },
];

// To share data between different root views, the best way is to
// use data frameworks such as flux or redux.
// Here we just use a simple event emitter.
const dataStore = new EventEmitter();

// The root react component of the app main surface
export default class MediaAppTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
  }

  _onClickNext = () => {
    const nextID = SCENE_DEF[this.state.index].next;
    this.setState({index: nextID});
    dataStore.emit('dataChange', nextID);
  };

  render() {
    const currentScene = SCENE_DEF[this.state.index];
    const nextScene = SCENE_DEF[SCENE_DEF[this.state.index].next];
    return (
      <View style={styles.panel}>
        <MediaAppTemplateScenePage
          currentScene={currentScene}
          nextScene={nextScene}
          onClickNext={this._onClickNext} />
      </View>
    );
  }
};

// The root react component of the subtitle surface
export class MediaAppTemplateSubtitle extends React.Component {
  state = {
    index: 0,
  };

  componentWillMount() {
    dataStore.addListener('dataChange', this._onDataChange);
  }
  componentWillUnmount() {
    dataStore.removeListener('dataChange', this._onDataChange);
  }
  _onDataChange = (index) => {
    this.setState({index: index});
  };
  render() {
    const currentScene = SCENE_DEF[this.state.index];
    return (
      <View style={styles.subtitle}>
        <MediaAppTemplateSubtitleText text={currentScene.subtitle} />
      </View>
    );
  }
};

// defining StyleSheet
const styles = StyleSheet.create({
  panel: {
    width: 1000,
    height: 600,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  subtitle: {
    width: 600,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    top: 600,
  },
});

class EarthMoonVR extends React.Component {
  constructor() {
    super();
    this.state = {
      rotation: 130,
	  zoom: -70,
    };
    this.lastUpdate = Date.now();
    this.spaceSkymap = [
      '../static_assets/space_right.png',
      '../static_assets/space_left.png',
      '../static_assets/space_up.png',
      '../static_assets/space_down.png',
      '../static_assets/space_back.png',
      '../static_assets/space_front.png'
    ];
    this.styles = StyleSheet.create({
	  menu: {
		flex: 1,
        flexDirection: 'column',
        width: 1,
        alignItems: 'stretch',
        transform: [{translate: [2, 2, -5]}],
	  },
	});

    this.rotate = this.rotate.bind(this);
  }

  componentDidMount() {
    this.rotate();
  }

  componentWillUnmount() {
    if (this.frameHandle) {
      cancelAnimationFrame(this.frameHandle);
      this.frameHandle = null;
    }
  }

  rotate() {
    const now = Date.now();
    const delta = now - this.lastUpdate;
    this.lastUpdate = now;

    this.setState({
		rotation: this.state.rotation + delta / 150
	});
    this.frameHandle = requestAnimationFrame(this.rotate);
  }

  render() {
    return (
      <View>
		<Pano source={ {uri: this.spaceSkymap} }/>

        <AmbientLight intensity={ 2.6 }  />

        <View style={ this.styles.menu }>
          <Button text='+'
			callback={() => this.setState((prevState) => ({ zoom: prevState.zoom + 10 }) ) } />
          <Button text='-'
			callback={() => this.setState((prevState) => ({ zoom: prevState.zoom - 10 }) ) } />
          <Button text='Next'
      callback={() => this.setState((prevState) => ({ zoom: prevState.zoom - 10 }) ) } />
          <Button text='Next'
      callback={() => this.setState((prevState) => ({ zoom: prevState.zoom - 10 }) ) } />
        </View>

        <Model
		  style={{
            transform: [
              {translate: [-25, 0, this.state.zoom]},
              {scale: 0.05 },
              {rotateY: this.state.rotation},
              {rotateX: 20},
              {rotateZ: -10}
            ],
          }}
          source={{obj:asset('earth.obj'), mtl:asset('earth.mtl')}}
		  lit={true}
        />

		<Model
		  style={{
			transform: [
			  {translate: [10, 10, this.state.zoom - 30]},
			  {scale: 0.05},
              {rotateY: this.state.rotation / 3},
			],
		  }}
		  source={{obj:asset('moon.obj'), mtl:asset('moon.mtl')}}
		  lit={true}
		/>
      </View>
    );
  }
};

AppRegistry.registerComponent('EarthMoonVR', () => EarthMoonVR);

// register the root component
// this will be used from client.js by r360.createRoot('MediaAppTemplate' ...)
AppRegistry.registerComponent('MediaAppTemplate', () => MediaAppTemplate);

// register another root component
// this will be used from client.js by r360.createRoot('MediaAppTemplate' ...)
AppRegistry.registerComponent('MediaAppTemplateSubtitle', () => MediaAppTemplateSubtitle);
