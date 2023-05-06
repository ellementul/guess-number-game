import { Application, Container, Color } from 'pixi.js';
import { Form } from './from.js'

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container

export default async function RenderFactory() {
  const app = new Application({ width: window.innerWidth, height: window.innerHeight });  
  document.body.appendChild(app.view);

  const view = new Container();

  app.stage.addChild(view);

  const form = Form({
    border: 5,
    textColor: new Color('#000000'),
    fontSize: 24,
    backgroundColor: new Color('#F1D583'),
    borderColor: new Color('#DCB000'),
    width: 320,
    height: 70,
    radius: 11,
    maxLength: 3,
    align: 'center',
    placeholder: 'Enter Your Number',
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    onChange: console.log
  })

  // Move container to the center
  view.x = app.screen.width / 2;
  view.y = app.screen.height / 2;

  // Center bunny sprite in local container coordinates
  view.pivot.x = view.width / 2;
  view.pivot.y = view.height / 2;

  view.addChild(form)
  return app
}