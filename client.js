
// This file contains the boilerplate to execute your React app.
// If you want to modify your application's content, start in "index.js"

import {ReactInstance,Location, Surface} from 'react-360-web';

function init(bundle, parent, options = {}) {



  // initialise instant game
  if (FBInstant) {
    FBInstant.initializeAsync()
    .then(function() {
      FBInstant.setLoadingProgress(100);
      FBInstant.startGameAsync();
    });
  }

  const subtitleSurface = new Surface(1200, 1000, Surface.SurfaceShape.Flat);
  subtitleSurface.setRadius(6);
  const r360 = new ReactInstance(bundle, parent, {
    // Add custom options here
    fullScreen: true,
    frame: () => {
      // This will makes the subtitle surface always in front of user
      // Please be careful about the design of any this kind of HMD-like surface.
      // It will be really hard to view and interact with the content in VR
      // if it's placed in a corner position.
      const cameraQuat = r360.getCameraQuaternion();
      subtitleSurface.recenter(cameraQuat, 'all');
    },
    ...options,
  });


    // Render the subtitle content to a flat surface
  //  r360.renderToSurface(
      //r360.createRoot('EarthMoonVR', { /* initial props */ }),
      //r360.getDefaultSurface()
  //  );

  // Render your app content to the default cylinder surface
  r360.renderToSurface(
    r360.createRoot('MediaAppTemplate', { /* initial props */ }),
    r360.getDefaultSurface()
  );

  // Render the subtitle content to a flat surface
  r360.renderToSurface(
    r360.createRoot('MediaAppTemplateSubtitle', { /* initial props */ }),
    subtitleSurface,
  );
  // Create three roots: two flat panels on the left and the right, and a Location
  // to mount rendered models in 3D space
  const leftPanel = new Surface(300, 600, Surface.SurfaceShape.Flat);
  leftPanel.setAngle(-0.6, 0);
  const rightPanel = new Surface(300, 600, Surface.SurfaceShape.Flat);
  rightPanel.setAngle(0.6, 0);
  r360.renderToSurface(
    r360.createRoot('TopPosts'),
    leftPanel,
  );
  r360.renderToSurface(
    r360.createRoot('CurrentPost'),
    rightPanel,
  );
  r360.renderToLocation(
    r360.createRoot('ModelView'),
    new Location([0, -2, -10]),
  );
}



  ///const r360 = new ReactInstance(bundle, parent, {
  //  fullScreen: true,
  //  ...options,
//  });





window.React360 = {init};
