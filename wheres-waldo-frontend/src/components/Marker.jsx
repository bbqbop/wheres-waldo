export default function Marker({ x, y, imgOffset, color = 'white', markerSize}){
  const style = {
      left: `${x + imgOffset[0] - markerSize / 2}px`,
      top: `${y + imgOffset[1] - markerSize / 2}px`,
      position: 'absolute',
      borderColor: color,
      width: `${markerSize}px`,
      height: `${markerSize}px`,
      border: `5px solid ${color}`,
      borderRadius: '50%',
      boxSizing: 'border-box',
      backgroundColor: 'transparent',
      pointerEvents: 'none',
  };
    
    return (
      <div style={style}>
      </div>
    ) 
}