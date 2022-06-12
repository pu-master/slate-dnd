import React, { useState, useCallback } from 'react'
import { createEditor, Path, Transforms } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'

import Paragraph from './Paragraph';

import './App.css';

const initialValue = [
  {
    children: [{ text: '' }],
  },
]

function App() {
  const [editor] = useState(() => withReact(createEditor()))
  // The path of a source paragraph being dragged.
  const [srcPath, setSrcPath] = useState(null)

  const renderElement = useCallback(props => (
    <Paragraph
      {...props}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    />
  ), []) // eslint-disable-line

  // Called when a drag handle starts being dragged.
  const handleDragStart = (element) => {
    setSrcPath(ReactEditor.findPath(editor, element))
  }

  // Called when a drag handle ends being dragged.
  const handleDragEnd = () => {
    setSrcPath(null)
  }

  // `dragover` event handler for the editor.
  const handleDragOver = (event) => {
    event.preventDefault()
    if (!srcPath) {
      // When you select a text outside the editor and drag it over here,
      // ignore it.
      event.dataTransfer.dropEffect = 'none'
    }
  }

  // `drop` event handler for the editor.
  const handleDrop = (event) => {
    event.preventDefault()
    if (!srcPath) {
      return
    }

    const node = ReactEditor.toSlateNode(editor, event.target)
    const destPath = ReactEditor.findPath(editor, node)

    if (Path.equals(destPath, [])) {
      // If an element is dropped into an area where other elements
      // are not present, there are two possibilities - it's dropped
      // at the very top, or at the very bottom.
      const destRange = ReactEditor.findEventRange(editor, event)
      if (Path.equals(destRange.anchor.path, [0, 0])) {
        // Dropped at the top.
        Transforms.moveNodes(editor, {
          at: [srcPath[0]],
          to: [0],
        })
      } else {
        // Dropped at the bottom.
        Transforms.moveNodes(editor, {
          at: [srcPath[0]],
          to: [editor.children.length],
        })
      }
    } else {
      // If an element is dropped onto another element,
      // move it after that another element.
      Transforms.moveNodes(editor, {
        at: [srcPath[0]],
        to: [destPath[0]],
      })
    }
  }

  return (
    <>
      <div className="demo-instructions">
        Click on the left-hand gray bar to start dragging.
      </div>
      <Slate editor={editor} value={initialValue}>
        <Editable
          className="slate-container"
          placeholder="Enter any text."
          renderElement={renderElement}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      </Slate>
    </>
  )
}

export default App
