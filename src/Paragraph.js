import React from 'react'

const Paragraph = ({ element, attributes, children, onDragStart, onDragEnd }) => {
  // `dragstart` event handler for a paragraph.
  const handleDragStart = (event) => {
    // Allow dragging originated from a drag handle only.
    if (!event.target.classList.contains('drag-handle')) {
      event.preventDefault()
    }
  }

  // `dragstart` event handler for a drag handle.
  const handleHandleDragStart = () => {
    onDragStart(element)
  }

  // `dragend` event handler for a drag handle.
  const handleHandleDragEnd = () => {
    onDragEnd()
  }

  return (
    <p
      {...attributes}
      className="paragraph"
      onDragStart={handleDragStart}
    >
      <span
        className="drag-handle"
        contentEditable="false"
        draggable="true"
        onDragStart={handleHandleDragStart}
        onDragEnd={handleHandleDragEnd}
      >
      </span>
      { children }
    </p>
  )
}

export default Paragraph
