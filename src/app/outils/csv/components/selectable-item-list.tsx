import React from 'react'

import theme from '@/theme/theme'

import ActionButtonNeutral from '../components/action-button-neutral'

interface SelectableItemListPropType {
  list: Array<{ key: string, value: string }>
  buttonIcon: '+' | '-'
  action: Function
}

export default function SelectableItemList({ list, buttonIcon, action }: SelectableItemListPropType) {
  return (
    <div>
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
      <style jsx>{`
          .list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(auto, 200px));
            grid-gap: 5px;
          }

          .item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border: 1px solid ${theme.colors.grey.main};
            white-space: nowrap;
            width: 100%;
            background: #000;
            cursor: pointer;
          }

          .text {
            overflow: auto;
            text-overflow: ellipsis;
            margin-left: 0.5em;
          }

          .selection {
            margin: 2em 0;
            padding: 0.5em;
            border: 1px dashed #ccc;
            background: #fff;
          }

          .button {
            font-size: larger;
            font-weight: bold;
            text-align: center;
            min-width: 20px;
            color: ${theme.colors.primary.main};
            background-color: ${theme.colors.primary.bg};
          }
      `}
      </style>
    </div>
  )
}
