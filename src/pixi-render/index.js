import { Application, Container, Graphics } from 'pixi.js';
import Circle from './circle'

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container

export default async function RenderFactory() {
  const app = new Application({ width: window.innerWidth, height: window.innerHeight });  
  document.body.appendChild(app.view);

  app.stage.interactive = true;
  app.stage.hitArea = app.screen;

  const view = new Container();
  app.stage.addChild(view);

  const circle = new Circle()

  app.stage.on('pointerdown', () => {
    circle.move(50)
  })

  view.addChild(circle);

  return app
}