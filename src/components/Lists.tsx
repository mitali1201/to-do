import { useState } from 'react'

import {
  DragDropContext,
  Draggable,
  Droppable,
  DroppableProvided,
  DraggableLocation,
  DropResult,
  DroppableStateSnapshot, DraggableProvided, DraggableStateSnapshot
} from 'react-beautiful-dnd';

import { FaRegTrashAlt } from 'react-icons/fa'

interface EList {
  title: string;
  items: {
    id: string,
    content: string
  }[]
}

interface EProps {
  lists: EList[],
  deleteItem: (id: string, title: string) => void
}

export const Lists = ({ lists, deleteItem }: EProps) => {
  const [listsState, setListsState] = useState(lists)

  const todo = listsState[0]
  const doing = listsState[1]
  const done = listsState[2]

  function handleDragEnd(e: any) {
    const fromList = e.source.droppableId
    const toList = e.destination.droppableId
    const fromIndex = e.source.index
    const toIndex = e.destination.index
    switch (toList) {
      case 'todo':
        if (fromList === 'doing') {
          todo.items.splice(toIndex, 0, doing.items[fromIndex])
          doing.items.splice(fromIndex, 1)
        } else if (fromList === 'done') {
          todo.items.splice(toIndex, 0, done.items[fromIndex])
          done.items.splice(fromIndex, 1)
        } else {
          const tod = todo.items[fromIndex]
          todo.items.splice(fromIndex, 1)
          todo.items.splice(toIndex, 0, tod)
        }
        break
      case 'doing':
        if (fromList === 'todo') {
          doing.items.splice(toIndex, 0, todo.items[fromIndex])
          todo.items.splice(fromIndex, 1)
        } else if (fromList === 'done') {
          doing.items.splice(toIndex, 0, done.items[fromIndex])
          done.items.splice(fromIndex, 1)
        } else {
          const doi = doing.items[fromIndex]
          doing.items.splice(fromIndex, 1)
          doing.items.splice(toIndex, 0, doi)
        }
        break
      case 'done':
        if (fromList === 'todo') {
          done.items.splice(toIndex, 0, todo.items[fromIndex])
          todo.items.splice(fromIndex, 1)
        } else if (fromList === 'doing') {
          done.items.splice(toIndex, 0, doing.items[fromIndex])
          doing.items.splice(fromIndex, 1)
        } else {
          const don = done.items[fromIndex]
          done.items.splice(fromIndex, 1)
          done.items.splice(toIndex, 0, don)
        }
        break
      case null:
        break
    }
    setListsState([todo, doing, done])
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {
        listsState.map(({ title, items }) =>
          <div key={title} className='list snap-end w-full mx-2 max-w-sm h-[89vh] rounded-xl bg-[#00000060] personal-shadow flex flex-col justify-between'>
            <div className="py-2 px-6 font-sans text-2xl font-bold uppercase flex justify-between gap-2 rounded-t-xl gradient-bg text-white">
              <h1>{title}</h1>
            </div>
            <Droppable droppableId={title}>
              {(provided: DroppableProvided) => (
                <ul ref={provided.innerRef} {...provided.droppableProps} className={`${title} overflow-y-auto scroll h-full`}>
                  {
                    items.length > 0 &&
                    items.map(({ id, content }, index) =>
                      <Draggable key={id} draggableId={id} index={index}>
                        {(providedDraggable: DraggableProvided) => (
                          <li ref={providedDraggable.innerRef}
                            {...providedDraggable.draggableProps}
                            {...providedDraggable.dragHandleProps} className='flex items-center justify-between border-b-[1px] border-b-[#fff5] last-of-type:border-none'>
                            <p className="text-xl font-bold text-[#fff] p-4 w-full">
                              {content}
                            </p>
                            <div className='mx-4'>
                              <button onClick={() => deleteItem(id, title)}>
                                <FaRegTrashAlt color='white' size={20} />
                              </button>
                            </div>
                          </li>
                        )}
                      </Draggable>
                    )
                  }
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
            <div className="h-2 rounded-b-xl gradient-bg" />
          </div>
        )
      }
    </DragDropContext >
  )
}