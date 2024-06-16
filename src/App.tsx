import { Vector } from 'p5';
import { useState } from 'react';
import './App.css';
import OptionsUI from './components/OptionsUI';
import P5Canvas from './components/P5Canvas';

const Shapes = ["Square", "Circle", "Triangle"];
export type Shape = typeof Shapes[number];

export type Force = {
	name: string;
	value: Vector | ((size: number) => Vector);
	enabled: boolean;
}

export default function App() {
	const [currentShape, setCurrentShape] = useState<Shape>("Square");
	const [currentBallShape, setCurrentBallShape] = useState<Shape>("Circle");
	const [currentBallCount, setCurrentBallCount] = useState<number>(0);
	const [currentBallSize, setCurrentBallSize] = useState<number>(10);
	const [currentBoundarySize, setCurrentBoundarySize] = useState<number>(100);
	const [segments, setSegments] = useState<number>(30);
	// const [forces, setForces] = useState<Force[]>([]);


	return (
		<div className="flex-col">
			<div>
				<OptionsUI changeShape={setCurrentShape}
					changeBallShape={setCurrentBallShape}
					changeBallCount={setCurrentBallCount}
					changeBallSize={setCurrentBallSize}
					changeBoundarySize={setCurrentBoundarySize}
					changeSegments={setSegments}
					shapes={Shapes}
					currentShape={currentShape}
					currentBallShape={currentBallShape}
					currentBallCount={currentBallCount}
					currentBallSize={currentBallSize}
					currentBoundarySize={currentBoundarySize}
					segments={segments}
				/>
			</div>
			<div className="mt-2 flex items-center justify-center">
				<P5Canvas
					// changeForces={setForces}
					shape={currentShape}
					segments={segments}
					ballShape={currentBallShape}
					ballCount={currentBallCount}
					ballSize={currentBallSize}
					boundarySize={currentBoundarySize}
					// forces={forces}
				/>
			</div>
		</div>
	)
}
