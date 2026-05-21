import React from 'react'

import { SelectableItemListWrapper } from './selectable-item-list.style'

import ActionButtonNeutral from '../components/action-button-neutral'

interface SelectableItemListPropType {
  list: Array<{ key: string, value: string }>
  buttonIcon: '+' | '-'
  action: (column: string) => void
}

export default function SelectableItemList({ list, buttonIcon, action }: SelectableItemListPropType) {
  return (
    <SelectableItemListWrapper>
      <div className={`${list.length > 0 && 'list selection'}`}>
        {list.map(item => typeof (item.value) === 'string' && (
          <ActionButtonNeutral
            label={buttonIcon === '+' ? `Sélectionner ${item.value}` : `Désélectionner ${item.value}`}
            key={item.key}
            isFullSize
            onClick={() => action(item.value)}
          >
            <div className="item">
              <div className="text">{item.value}</div>
              <div className="button">{buttonIcon}</div>
            </div>
          </ActionButtonNeutral>
        ))}
      </div>
    </SelectableItemListWrapper>
  )
}
