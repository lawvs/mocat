import React, { useState } from 'react'
import {
  Box,
  Grid,
  Chip,
  ButtonGroup,
  Button,
  IconButton,
  Tooltip,
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core'
import { HourglassEmpty as HourglassEmptyIcon } from '@material-ui/icons'

import { Drawer } from './components/drawer'
import { useMockState, useAutoResponder, useStore } from './store'
import { ActionCard } from './components/action-card'
import { MaterialUI } from './theme'

const useStyles = makeStyles<Theme, { deg?: number }>((theme: Theme) =>
  createStyles({
    toolBar: {
      '& > *': {
        margin: theme.spacing(0.5),
      },
    },
    delayBtn: {
      transform: ({ deg = 0 }) => `rotate(${deg}deg)`,
      transition: `transform ${theme.transitions.duration.standard}ms ease`,
    },
  })
)

const ToolBar = () => {
  const {
    enable,
    mode,
    delay,
    toggleDelay,
    toggleEnable,
    switchMode,
  } = useAutoResponder()
  const { disablePass } = useStore()
  const [btnDeg, setBtnDeg] = useState(0)
  const classes = useStyles({ deg: btnDeg })

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
          .map((btnMode) => (
            <Button
              color={
                mode === btnMode
                  ? enable
                    ? 'secondary'
                    : 'primary'
                  : 'default'
              }
              onClick={() => switchMode(btnMode)}
              key={btnMode}
            >
              {btnMode}
            </Button>
          ))}
      </ButtonGroup>
      <Tooltip title={delay + 'ms'} placement="top">
        <IconButton
          className={classes.delayBtn}
          onClick={() => {
            setBtnDeg(btnDeg + 180)
            toggleDelay()
          }}
          size="small"
          color={enable ? 'secondary' : 'default'}
        >
          <HourglassEmptyIcon />
        </IconButton>
      </Tooltip>
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
  const classes = useStyles({})
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
