import { useState } from 'react';
import './App.css';
import OptionsUI from './components/OptionsUI';
import P5Canvas from './components/P5Canvas';

const Shapes = ["Square", "Circle", "Triangle"];
export type Shape = typeof Shapes[number];

export default function App() {

	const [currentShape, setCurrentShape] = useState<Shape>("Square");
	const [currentBallShape, setCurrentBallShape] = useState<Shape>("Circle");
	const [currentBallCount, setCurrentBallCount] = useState<number>(0);
	const [currentBallSize, setCurrentBallSize] = useState<number>(10);
	const [currentBoundarySize, setCurrentBoundarySize] = useState<number>(100);

	return (
		<>
			<OptionsUI changeShape={setCurrentShape}
				changeBallShape={setCurrentBallShape}
				changeBallCount={setCurrentBallCount}
				changeBallSize={setCurrentBallSize}
				changeBoundarySize={setCurrentBoundarySize}
				shapes={Shapes}
				currentShape={currentShape}
				currentBallShape={currentBallShape}
				currentBallCount={currentBallCount}
				currentBallSize={currentBallSize}
				currentBoundarySize={currentBoundarySize}
			/>
			<P5Canvas shape={currentShape}
				ballShape={currentBallShape}
				ballCount={currentBallCount}
				ballSize={currentBallSize}
				boundarySize={currentBoundarySize}
			/>
		</>
	)
}
