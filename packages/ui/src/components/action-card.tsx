import React from 'react'
import styled from 'styled-components'

const Card = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 300px;
  overflow: hidden;
  border-radius: 4px;
  padding: 8px;
  color: #fff;
  background-color: #424242;
  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);

  & + & {
    margin-top: 8px;
  }
`

const Button = styled.button<{ variant?: string }>`
  color: rgba(232, 230, 227, 0.87);
  box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 1px -2px,
    rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
  background-color: rgb(42, 45, 47);
  border: none;
  min-width: 64px;
  border-radius: 4px;
  outline: 0;
  cursor: pointer;
  user-select: none;

  &:hover {
    box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px -1px,
      rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px;
    background-color: rgb(48, 52, 54);
  }

  &:active {
    transform: translateY(2px);
  }

  & + & {
    margin-left: 8px;
  }
`
const ButtonGroup = styled.div`
  display: flex;
  margin: 8px 0;
`
const Name = styled.div``
const Desc = styled.div``

export interface ActionCardProps {
  type?: string
  name: string
  desc?: string
  actions?: {
    variant: string
    name: string
    action: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  }[]
}

export const ActionCard: React.FC<ActionCardProps> = ({
  name,
  desc,
  children,
  actions,
}) => {
  return (
    <Card>
      <Name>{name}</Name>
      <Desc>{desc}</Desc>
      {children}

      {actions && (
        <ButtonGroup>
          {actions.map((i) => (
            <Button key={i.name} onClick={i.action}>
              {i.name}
            </Button>
          ))}
        </ButtonGroup>
      )}
    </Card>
  )
}
