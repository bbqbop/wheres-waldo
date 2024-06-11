export default function Marker({ className, x, y, offset, color = 'white', markerSize}){
  const style = {
      left: `${x - markerSize / 2}px`,
      top: `${y - markerSize / 2}px`,
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