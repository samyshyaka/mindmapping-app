// Node component for rendering and handling interactions with nodes in the mindmap
// By Samuel Dushimimana Shyaka, CMU MSIT

// This component represents nodes in a graph, allowing interaction such as 
// selection, dragging, and text editing.
// Props:
// - node: Object containing information about the node (e.g., text, position)
// - selectNode: Function to select a node
// - handleDrag: Function to handle dragging of a node
// - selected: Boolean indicating if the node is currently selected
// - order: Boolean indicating if the node is a main topic or not
//===================================================================

import React, { useState, useRef, useEffect } from 'react';

const Node = ({ node, selectNode, handleDrag, selected, order }) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(node.text);
  const nodeRef = useRef(null);
  const canvasRef = useRef(null);
  const textInputRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw node shape based on the order
    if (order === 'main-topic') {
      // Draw circle for main topic
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 65, 0, 2 * Math.PI);
      ctx.fillStyle = '#f0f0f0';
      ctx.fill();
      ctx.strokeStyle = selected ? '#192636' : '#999';
      ctx.lineWidth = selected ? 2 : 1;
      ctx.stroke();
    } else {
      // Draw rectangle for sub nodes
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = selected ? '#192636' : '#777';
      ctx.lineWidth = 2
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }

    // Draw node text
    ctx.fillStyle = selected ? '#192636' : '#000';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  }, [text, selected, order, editing]);

  // Handle click to select a node
  const handleClick = (e) => {
    e.stopPropagation();
    selectNode(node);
  };

  // Handle double click to initiate editing mode
  const handleDoubleClick = () => {
    setEditing(true);
  };

  // Handle onBlur event to finalize editing
  const handleBlur = () => {
    setEditing(false);
    // Update the node text when editing is finished
    node.text = text;
  };

  // Handle mouse down to enable dragging and bring the node to the front
  const handleMouseDown = (e) => {
    e.stopPropagation();
    selectNode(node);
    nodeRef.current.style.zIndex = 100; // Bring the selected node to the front
    const startX = e.clientX - node.x;
    const startY = e.clientY - node.y;

    // Handle mouse move for dragging
    const handleMouseMove = (e) => {
      const newX = e.clientX - startX;
      const newY = e.clientY - startY;
      handleDrag(e, { ...node, x: newX, y: newY });
    };

    // Handle mouse up to stop dragging
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      nodeRef.current.style.zIndex = ''; // Reset the node's z-index
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div
      className={`node ${selected ? 'selected' : ''} ${order ? 'main-topic' : ''}`}
      style={{ left: node.x, top: node.y }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      ref={nodeRef}
    >
      <canvas
        ref={canvasRef}
        width={order === 'main-topic' ? 131 : 100}
        height={order === 'main-topic' ? 131 : 40}
      ></canvas>

      {editing && (
        <input
          ref={textInputRef}
          type="text"
          value={text}
          onChange={handleInputChange}
          onBlur={handleBlur}
          autoFocus
        />
      )}
    </div>
  );
};

export default Node;