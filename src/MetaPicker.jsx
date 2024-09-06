import React, { useState, useEffect } from 'react';

const MetaPicker = ({ playedColors, onColorChange }) => {
  const [color1, setColor1] = useState(null);
  const [color2, setColor2] = useState(null);

  const colors = ['amber', 'emerald', 'ruby', 'sapphire', 'amethyst', 'steel'];

  // Use effect to initialize color1 and color2 based on colors prop
  useEffect(() => {
    if (playedColors) {
      const [initialColor1, initialColor2] = playedColors.split('/');
      setColor1(initialColor1 || null);
      setColor2(initialColor2 || null);
    }
  }, [playedColors]); // Dependency array to run effect when colors prop changes

  const handleClick = (color) => {
    if (color1 === null) {
      setColor1(color);
    } else if (color2 === null && color !== color1) {
      setColor2(color);
      onColorChange(sortedColors([color1, color]).join('/'));
    } else if (color !== color1 && color !== color2) {
      setColor1(color2);
      setColor2(color);
      onColorChange(sortedColors([color2, color]).join('/'));
    }
  };

  const sortedColors = (c) => {
    return c.sort((a, b) => {
      return colors.indexOf(a) - colors.indexOf(b);
    });
  };

  // Use effect to log color1 and color2 when they change
  /*
  useEffect(() => {
    console.log('New colors: ', color1, color2);
  }, [color1, color2]); // Dependency array with color1 and color2
  */

  const isSelected = (color) => {
    return color1 === color || color2 === color;
  };

  return (
    <div className="color-picker">
      {colors.map((color) => (
        <div
          key={color}
          role="button"
          className={`pair ${color} ${isSelected(color) ? 'selected' : ''}`}
          onClick={() => handleClick(color)}
        >
          {color.charAt(0).toUpperCase()}
        </div>
      ))}
    </div>
  );
};

export default MetaPicker;
