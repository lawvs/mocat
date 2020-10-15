import React from 'react'
import {
  Box,
  Grid,
  Chip,
  ButtonGroup,
  Button,
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core'

import { Drawer } from './components/drawer'
import { useMockState, useAutoResponder, useStore } from './store'
import { ActionCard } from './components/action-card'
import { MaterialUI } from './theme'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolBar: {
      '& > *': {
        margin: theme.spacing(0.5),
      },
    },
  })
)

const ToolBar = () => {
  const {
    enable,
    mode: autoResponseMode,
    toggleEnable,
    switchMode,
  } = useAutoResponder()
  const { disablePass } = useStore()

  const responseModeBtn = ['scene', 'pass', 'reject'] as const

  return (
    <>
      <Chip
        label="Auto Response"
        clickable
        size="small"
        color={enable ? 'secondary' : 'default'}
        onClick={toggleEnable}
      />
      <ButtonGroup variant="contained" size="small">
        {responseModeBtn
          .filter((i) => !disablePass || i !== 'pass')
          .map((mode) => (
            <Button
              color={
                autoResponseMode === mode
                  ? enable
                    ? 'secondary'
                    : 'primary'
                  : 'default'
              }
              onClick={() => switchMode(mode)}
              key={mode}
            >
              {mode}
            </Button>
          ))}
      </ButtonGroup>
    </>
  )
}

const Mock = () => {
  const [state, setState] = useMockState()

  return (
    <Grid container direction="column" alignItems="stretch" spacing={2}>
      {state.map((e) => (
        <Grid item key={e.timeStamp} xs={12}>
          <ActionCard
            event={e}
            afterHandle={() => {
              setState(state.filter((i) => i !== e))
            }}
          ></ActionCard>
        </Grid>
      ))}
    </Grid>
  )
}

export const App = () => {
  const classes = useStyles()
  return (
    <React.StrictMode>
      <MaterialUI>
        <Drawer>
          <Box className={classes.toolBar} p={1}>
            <ToolBar />
          </Box>
          <Box display="flex" flexDirection="column" px={2}>
            <Mock />
          </Box>
        </Drawer>
      </MaterialUI>
    </React.StrictMode>
  )
}
