import React from 'react';
import { View } from 'react-native';

interface CanvasProps {
    onDrawingFinish: (base64Image: string) => void;
}

const CanvasComponent: React.FC<CanvasProps> = ({ onDrawingFinish }) => {
    return (
        <View style={{ 
            width: 280, 
            height: 280, 
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#000' 
        }} />
    );
};

export default CanvasComponent;
