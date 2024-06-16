import { Vector } from 'p5';
import { useState } from 'react';
import './App.css';
import OptionsUI from './components/OptionsUI';
import P5Canvas from './components/P5Canvas';

const Shapes = ["Square", "Circle", "Triangle"];
const BoundaryShapes = ["Square", "Circle", "Triangle", "Random"]
export type Shape = typeof Shapes[number];
export type BoundaryShape = typeof BoundaryShapes[number];

export type Force = {
	name: string;
	value: Vector | ((size: number) => Vector);
	enabled: boolean;
}

export default function App() {
	const [currentShape, setCurrentShape] = useState<Shape>("Square");
	const [currentBallShape, setCurrentBallShape] = useState<Shape>("Circle");
	const [currentBallCount, setCurrentBallCount] = useState<number>(0);
	const [currentBallSize, setCurrentBallSize] = useState<number>(5);
	const [currentBoundarySize, setCurrentBoundarySize] = useState<number>(100);
	const [segments, setSegments] = useState<number>(30);
	const [isRaycastingEnabled, setIsRaycastingEnabled] = useState<boolean>(false);
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
					changeRayCasting={setIsRaycastingEnabled}
					shapes={Shapes}
					boundaryShapes={BoundaryShapes}
					currentShape={currentShape}
					currentBallShape={currentBallShape}
					currentBallCount={currentBallCount}
					currentBallSize={currentBallSize}
					currentBoundarySize={currentBoundarySize}
					segments={segments}
					isRaycastingEnabled={isRaycastingEnabled}
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
					isRaycastingEnabled={isRaycastingEnabled}
				// forces={forces}
				/>
			</div>
		</div>
	)
}
