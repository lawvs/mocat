import { StrictMode, useCallback, useState } from 'react'
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
import type { AutoResponderState } from './store/autoResponder'
import { MaterialUI } from './store/theme'
import { useTranslation } from './i18n'

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
  const { t } = useTranslation()

  const handleMode = useCallback(
    (
      event: React.MouseEvent<HTMLElement>,
      newMode: AutoResponderState['mode'] | null
    ) => {
      if (newMode === null) {
        return
      }
      switchMode(newMode)
    },
    [switchMode]
  )

  const handleDelay = useCallback(() => {
    setBtnDeg(btnDeg + 180)
    toggleDelay()
  }, [btnDeg, toggleDelay])

  return (
    <Box className={classes.toolBar} sx={{ padding: 1, whiteSpace: 'nowrap' }}>
      <Chip
        label={t('Auto Response')}
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
        {['Scenario', 'Pass', 'Reject']
          .filter((i) => !disablePass || i !== 'pass')
          .map((btnMode) => (
            <ToggleButton value={btnMode} aria-label={btnMode} key={btnMode}>
              {t(btnMode)}
            </ToggleButton>
          ))}
      </ToggleButtonGroup>

      <Tooltip title={t('Delay', { millisecond: delay })} placement="top">
        <IconButton
          className={classes.delayBtn}
          onClick={handleDelay}
          size="small"
        >
          <HourglassEmptyIcon />
        </IconButton>
      </Tooltip>
    </Box>
  )
}

const Mock = () => {
  const [state] = useMockState()

  return (
    <Grid container direction="column" alignItems="stretch" spacing={2}>
      {state.map((e) => (
        <Grid item key={e.timeStamp} xs={12}>
          <ActionCard event={e}></ActionCard>
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
