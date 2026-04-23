"use client";
import React, { useEffect, useState } from "react";

interface IconData {
  id: number;
  icon: string;
  size: number;
  duration: number;
  delay: number;
  animationType: string;
  top: number;
  left: number;
  opacity: number;
}

const iconsList = [
  "fa-desktop", "fa-laptop", "fa-computer-mouse", "fa-keyboard",
  "fa-microchip", "fa-video", "fa-gamepad", "fa-headphones",
  "fa-mobile-alt", "fa-wifi", "fa-server", "fa-hdd"
];

const FloatingIconsBackground = () => {
  const [icons, setIcons] = useState<IconData[]>([]);

  useEffect(() => {
    const iconCount = 48;
    
    // Generate evenly distributed positions
    const generatePositions = () => {
      const pos: { top: number, left: number }[] = [];
      const rows = 6;
      const cols = 8;
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (pos.length < iconCount && Math.random() > 0.5) {
            pos.push({
              top: (row / rows) * 100 + Math.random() * (100 / rows),
              left: (col / cols) * 100 + Math.random() * (100 / cols)
            });
          }
        }
      }
      
      // Add edge icons
      const edges = [
        { top: 5, left: 5 }, { top: 5, left: 50 }, { top: 5, left: 95 },
        { top: 50, left: 5 }, { top: 50, left: 95 },
        { top: 95, left: 5 }, { top: 95, left: 50 }, { top: 95, left: 95 }
      ];
      
      edges.forEach(edge => {
        if (pos.length < iconCount) {
          pos.push(edge);
        }
      });
      
      // If we are still below the count, pad it randomly
      while (pos.length < iconCount) {
        pos.push({
          top: Math.random() * 100,
          left: Math.random() * 100
        });
      }
      
      return pos.slice(0, iconCount);
    };

    const positions = generatePositions();

    const generatedIcons: IconData[] = positions.map((pos, i) => {
      const size = Math.random() * 40 + 20; // 20px to 60px
      const duration = Math.random() * 8 + 6; // 6s to 14s (faster)
      const delay = Math.random() * 5; // 0s to 5s
      const opacity = 0.08 + Math.random() * 0.08; // 0.08 to 0.16 (more visible)
      
      return {
        id: i,
        icon: iconsList[Math.floor(Math.random() * iconsList.length)],
        size,
        duration,
        delay,
        animationType: ["floatUpDown", "floatLeftRight", "floatRotate"][Math.floor(Math.random() * 3)],
        top: pos.top,
        left: pos.left,
        opacity,
      };
    });
    
    setIcons(generatedIcons);
  }, []);

  if (icons.length === 0) return null;

  return (
    <div className="floating-icons-container">
      {icons.map((item, index) => (
        <i
          key={item.id}
          className={`fas ${item.icon} floating-icon type-${item.animationType} icon-index-${index}`}
          style={{
            top: `${item.top}%`,
            left: `${item.left}%`,
            fontSize: `${item.size}px`,
            opacity: item.opacity,
            animationDuration: `${item.duration}s`,
            animationDelay: `${item.delay}s`,
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
};

export default FloatingIconsBackground;
