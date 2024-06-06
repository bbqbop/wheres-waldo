export default function Marker({ className, x, y, offset, color = 'white' }){

  const markerSize = 50; // Assuming the marker is 50x50 pixels

  const style = {
      left: `${x + offset[0] - markerSize / 2}px`,
      top: `${y + offset[1] - markerSize / 2}px`,
      position: 'absolute',
      borderColor: color,
      width: `${markerSize}px`,
      height: `${markerSize}px`,
      border: `5px solid ${color}`,
      borderRadius: '50%',
      boxSizing: 'border-box',
      zIndex: 999,
  };
    
    return (
      <div style={style}>
      </div>
    ) 
}