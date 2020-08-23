import React from 'react'
import styled from 'styled-components'
import { Drawer } from './components/drawer'
import { useEventState } from './hook'
import { ActionCard } from './components/action-card'

const MainWrapper = styled.div`
  width: 200px;
  display: flex;
  flex-direction: column;
  padding: 8px;
  overflow: auto;
`

const ActionList = styled.div`
  max-height: 100%;
`

const Main = () => {
  const [state, setState] = useEventState('event')
  return (
    <MainWrapper>
      <ActionList>
        {state.map((e) => (
          <ActionCard key={e.name} name={e.name}>
            {JSON.stringify(e)}
          </ActionCard>
        ))}
      </ActionList>
    </MainWrapper>
  )
}

export const App = () => {
  return (
    <React.StrictMode>
      <Drawer>
        <Main />
      </Drawer>
    </React.StrictMode>
  )
}
