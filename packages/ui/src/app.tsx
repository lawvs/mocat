import { HourglassEmpty as HourglassEmptyIcon } from '@mui/icons-material'
import {
  Box,
  Chip,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from '@mui/material'
import { StrictMode, useCallback, useState } from 'react'
import { ActionCard } from './components/actionCard'
import { Drawer } from './components/drawer'
import { useTranslation } from './i18n'
import { useAutoResponder, useMockState, useStore } from './store'
import type { AutoResponderState } from './store/autoResponder'
import { MaterialUI } from './store/theme'

const ToolBar = () => {
  const { enable, mode, delay, toggleDelay, toggleEnable, switchMode } =
    useAutoResponder()
  const { disablePass } = useStore()
  const [btnDeg, setBtnDeg] = useState(0)
  const { t } = useTranslation()

  const handleMode = useCallback(
    (
      event: React.MouseEvent<HTMLElement>,
      newMode: AutoResponderState['mode'] | null,
    ) => {
      if (newMode === null) {
        return
      }
      switchMode(newMode)
    },
    [switchMode],
  )

  const handleDelay = useCallback(() => {
    setBtnDeg(btnDeg + 180)
    toggleDelay()
  }, [btnDeg, toggleDelay])

  return (
    <Box
      sx={{
        padding: 1,
        whiteSpace: 'nowrap',
        '& > *': {
          margin: (theme) => theme.spacing(0.5),
        },
      }}
    >
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
          sx={{
            transform: `rotate(${btnDeg}deg)`,
            transition: (theme) =>
              `transform ${theme.transitions.duration.standard}ms ease`,
          }}
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
    <>
      {state.map((e) => (
        <Box
          key={e.timeStamp}
          sx={{ marginBottom: (theme) => theme.spacing(2) }}
        >
          <ActionCard event={e}></ActionCard>
        </Box>
      ))}
    </>
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
