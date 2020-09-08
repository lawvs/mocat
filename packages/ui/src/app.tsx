import React from 'react'
import { Box, Grid } from '@material-ui/core'

import { Drawer } from './components/drawer'
import { useMockState } from './hook'
import { ActionCard } from './components/action-card'
import { MaterialUI } from './theme'

const Mock = () => {
  const [state] = useMockState()

  return (
    <Grid container direction="column" alignItems="stretch" spacing={2}>
      {state.map((e) => (
        // TODO fix key
        <Grid item key={Math.random()} xs={12}>
          <ActionCard event={e}></ActionCard>
        </Grid>
      ))}
    </Grid>
  )
}

export const App = () => {
  return (
    <React.StrictMode>
      <MaterialUI>
        <Drawer>
          <Box display="flex" flexDirection="column" p={2} color="text.primary">
            <Mock />
          </Box>
        </Drawer>
      </MaterialUI>
    </React.StrictMode>
  )
}
