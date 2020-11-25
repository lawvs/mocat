import { StrictMode, useState } from 'react'
import {
  Box,
  Grid,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Tooltip,
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core'
import { HourglassEmpty as HourglassEmptyIcon } from '@material-ui/icons'

import { Drawer } from './components/drawer'
import { ActionCard } from './components/actionCard'
import { useMockState, useAutoResponder, useStore } from './store'
import { MaterialUI } from './store/theme'

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

  const handleMode = (
    event: React.MouseEvent<HTMLElement>,
    newMode: 'scene' | 'pass' | 'reject' | null
  ) => {
    if (newMode === null) {
      return
    }
    switchMode(newMode)
  }

  return (
    <Box className={classes.toolBar} sx={{ padding: 1, whiteSpace: 'nowrap' }}>
      <Chip
        label="Auto Response"
        clickable
        size="small"
        color={enable ? 'secondary' : 'default'}
        onClick={toggleEnable}
      />
      <ToggleButtonGroup
        size="small"
        exclusive
        value={mode}
        onChange={handleMode}
        aria-label="auto response mode"
      >
        {responseModeBtn
          .filter((i) => !disablePass || i !== 'pass')
          .map((btnMode) => (
            <ToggleButton value={btnMode} aria-label={btnMode} key={btnMode}>
              {btnMode}
            </ToggleButton>
          ))}
      </ToggleButtonGroup>

      <Tooltip title={delay + 'ms'} placement="top">
        <IconButton
          className={classes.delayBtn}
          onClick={() => {
            setBtnDeg(btnDeg + 180)
            toggleDelay()
          }}
          size="small"
        >
          <HourglassEmptyIcon />
        </IconButton>
      </Tooltip>
    </Box>
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
  return (
    <StrictMode>
      <MaterialUI>
        <Drawer>
          <ToolBar />
          <Box sx={{ display: 'flex', paddingX: 2, flexDirection: 'column' }}>
            <Mock />
          </Box>
        </Drawer>
      </MaterialUI>
    </StrictMode>
  )
}
