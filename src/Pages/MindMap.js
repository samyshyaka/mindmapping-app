// Component for creating and managing a mind map interface. 
// By Samuel Dushimimana Shyaka, CMU MSIT

// This React componenent utilizes React Hooks to manage the state of nodes, 
// allowing users to add, delete, and manipulate hierarchical nodes on a canvas. 
// The component employs event handling for node selection, dragging, and rendering 
// connections between parent and child nodes. 
// It leverages the Node component for individual node representation and utilizes 
// FontAwesome icons for adding and removing nodes. 
// The module encapsulates the functionality required to visualize and interact with 
// a dynamic mind map structure within a React application.
//===================================================================

// Import necessary modules and components
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import Node from '../Componets/Node';

const MindMap = () => {
  // State variables for nodes and selectedNode using React Hooks
  const [nodes, setNodes] = useState([
    {
      id: 0,
      text: ' Central Topic',
      x: window.innerWidth / 2 - 80,
      y: window.innerHeight / 2 - 220,
      children: [],
    },
  ]);
  const [selectedNode, setSelectedNode] = useState(null);

  // Function to add a new node
  const addNode = () => {
    if (selectedNode) {
      // Determine the position of the new node based on the selected node
      const mainTopicNode = nodes.find((n) => n.id === 0);
      const nodesOnRight = nodes.filter((n) => n.id !== 0 && n.x > mainTopicNode.x);
  
      let newNodeX, newNodeY;
      if (selectedNode.id === 0) {
        // Adding nodes to the right or left of the main topic node
        if (nodesOnRight.length < 3) {
          newNodeX = mainTopicNode.x + 200;
          newNodeY = mainTopicNode.y + 50;
        } else {
          newNodeX = mainTopicNode.x - 200;
          newNodeY = mainTopicNode.y + 50;
        }
      } else {
        // Adding nodes to the right or left of the sub topic node
        if (selectedNode.x > mainTopicNode.x) {
          newNodeX = selectedNode.x + 200;
          newNodeY = selectedNode.y;
        } else {
          newNodeX = selectedNode.x - 200;
          newNodeY = selectedNode.y;
        }
      }
  
      let newNode = {
        id: nodes.length,
        text: '',
        x: newNodeX,
        y: newNodeY,
        children: [],
      };

      // Check if there's a node already at the intended position
      const nodeAtPosition = nodes.find(
        (n) => n.x === newNode.x && n.y === newNode.y
      );

      // Check if there's a node above the intended position
      const nodeAbovePosition = nodes.find(
        (n) => n.x === newNode.x && n.y < newNode.y
      );

      // If there's a node at the intended position, adjust Y position accordingly
      if (nodeAtPosition) {
        if (nodeAbovePosition) {
          newNode.y = nodeAtPosition.y + 100;
        } else {
          newNode.y = nodeAtPosition.y - 100;
        }
      }

      // Update nodes array with the new node and its parent-child relationship

      const updatedNodes = [...nodes, newNode];
      
      const parentNodeIndex = nodes.findIndex((n) => n.id === selectedNode.id);
      const updatedParentNode = { ...selectedNode };
      updatedParentNode.children.push(newNode.id);
      
      const updatedNodesArray = [...updatedNodes];
      updatedNodesArray[parentNodeIndex] = updatedParentNode;

      // Set updated nodes and reset the selected node
      setNodes(updatedNodesArray);
      setSelectedNode(null);
    }
  };
  

  // Function to handle selecting a node
  const selectNode = (node) => {
    setSelectedNode(node);
  };

  // Function to handle dragging a node
  const handleDrag = (e, node) => {
    e.preventDefault();
    if (selectedNode && selectedNode.id === node.id) {
      const newX = node.x + e.movementX;
      const newY = node.y + e.movementY;
      const updatedNodes = nodes.map((n) =>
        n.id === node.id ? { ...n, x: newX, y: newY } : n
      );
      setNodes(updatedNodes);
    }
  };

  // Function to handle clicking outside a node to deselect it
  const handleClickOutsideNode = () => {
    setSelectedNode(null);
  };

  // Function to delete a node and its references
  const deleteNode = () => {
    if (selectedNode) {
      const updatedNodes = nodes.filter((node) => node.id !== selectedNode.id);
      // Remove references to the deleted node from its parent's children array
      const updatedNodesWithRemovedReference = updatedNodes.map((node) => ({
        ...node,
        children: node.children.filter((childId) => childId !== selectedNode.id),
      }));
      setNodes(updatedNodesWithRemovedReference);
      setSelectedNode(null); // Clear selected node after deletion
    }
  };

  return (
    // JSX for rendering the MindMap component
    <div className="mind-map" onClick={handleClickOutsideNode}>

      {/* Rendering nodes and connecting lines */}
      <div className="canvas">
        {nodes.map((node) => (
          <React.Fragment key={node.id}>
            {node.children.map((childId) => {
              const childNode = nodes.find((n) => n.id === childId);
              if (childNode) {
                return (
                  <svg
                    key={`line-${node.id}-${childNode.id}`}
                    className='line'
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
                  >
                    <line
                      x1={node.x + 100}
                      y1={node.id === 0 ? node.y + 170 : node.y + 120}
                      x2={childNode.x + 80}
                      y2={childNode.y + 120}
                      stroke="black"
                    />
                  </svg>
                );
              }
              return null;
            })}

            {/* Rendering the Node component with necessary props */}
            <Node
              node={node}
              selectNode={selectNode}
              handleDrag={handleDrag}
              selected={selectedNode && selectedNode.id === node.id}
              order={node.id === 0 ? 'main-topic' : ''}
            />
          </React.Fragment>
        ))}
      </div>

      {/* Buttons for adding and deleting nodes */}
      <div className='buttons'>
        <button className='add-icon' onClick={addNode}><FontAwesomeIcon icon={faPlus} /></button>
        <button className='delete-icon' onClick={deleteNode}><FontAwesomeIcon icon={faTrash} /></button>
      </div>

    </div>
  );
};

export default MindMap;
