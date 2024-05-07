import { ReactP5Wrapper, Sketch } from "@p5-wrapper/react";
import { Vector } from "p5";
import { Shape } from "../App";
import Ball from "./p5/Ball";
import Boundary from "./p5/Boundary";
import Drawer from "./p5/Drawer";

interface P5CanvasProps {
    shape: Shape;
    ballShape: Shape;
    ballCount: number;
    shapes: Shape[];
}

export default function P5Canvas(props: P5CanvasProps) {
    // const [rotation, setRotation] = useState(0);
    const balls: Ball[] = [];

    /*type sketchProps = SketchProps & {
        rotation: number;
    }*/

    const sketch: Sketch = p5 => {
        p5.setup = () => {
            p5.createCanvas(600, 400, p5.WEBGL);
            for (let i = 0; i < props.ballCount; i++) {
                balls.push(new Ball(p5, props.ballShape, props.shapes, 5));
            }
        }

        p5.draw = () => {
            p5.background(100);
            p5.normalMaterial();
            /*if (rotation !== 0) {
                p5.rotateY(rotation);
            }*/
            // p5.push();
            const boundary = new Boundary(p5, props.shape, props.shapes, 100, p5.createVector(0, 0));
            boundary.createBoundary();

            const drawer = new Drawer(p5);
            balls.forEach(ball => {
                const gravity: Vector = p5.createVector(0, 0.1 * ball.size);
                ball.applyForce(gravity);
                ball.update();
                ball.display();
                const edges = drawer.calculateVertices(ball.shape, ball.position, 100, 30);
                const isInside = boundary.contains(ball.position);
                console.log(isInside);
                // Use constrain()???
                ball.checkEdges(isInside);
            });
        }

        /*// Not liking how I'm redefining this locally. Might want to change later...
        p5.updateWithProps = (props: { rotation: number }) => {
            if (props.rotation) {
                setRotation((props.rotation * Math.PI) / 180);
            }
        };*/
    }

    /*useEffect(() => {
        const interval = setInterval(() => {
            setRotation(rotation => rotation + 100);
        }, 100);
        return () => {
            clearInterval(interval);
        };
    }, []);*/

    return <ReactP5Wrapper sketch={sketch} /*rotation={rotation}*/ />;
}