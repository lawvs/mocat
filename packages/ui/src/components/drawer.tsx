import React from 'react'
import {
  makeStyles,
  useTheme,
  createStyles,
  Box,
  Fab,
  Drawer as MUIDrawer,
  Divider,
  ClickAwayListener,
  Zoom,
  IconButton,
} from '@material-ui/core'
import type { Theme } from '@material-ui/core/styles/createMuiTheme'
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Build as BuildIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
} from '@material-ui/icons'

import { useAutoResponder, useDrawer, useThemeSwitch } from '../store'

const drawerWidth = 400

const useStyles = makeStyles<Theme, { pin?: boolean }>((theme: Theme) =>
  createStyles({
    '@global': {
      html: {
        'margin-right': ({ pin = false }) => pin && drawerWidth,
      },
    },
    fab: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
      zIndex: 999999,
    },
    fabExtendedIcon: {
      marginRight: theme.spacing(1),
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      'overflow-x': 'hidden',
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-start',
    },
  })
)

const FloatingActionButton = ({
  show,
  onClick,
}: {
  show: boolean
  onClick: () => void
}) => {
  const classes = useStyles({})
  const { enable: autoResponseEnable } = useAutoResponder()

  return (
    <Zoom in={show}>
      <Fab
        className={classes.fab}
        color={autoResponseEnable ? 'secondary' : 'primary'}
        variant="extended"
        aria-label="mock"
        onClick={onClick}
      >
        <BuildIcon className={classes.fabExtendedIcon} />
        Mock
      </Fab>
    </Zoom>
  )
}

const ThemeSwitch = () => {
  const { toggle, currentTheme } = useThemeSwitch()

  return (
    <IconButton onClick={toggle}>
      {currentTheme === 'light' ? <DarkIcon /> : <LightIcon />}
    </IconButton>
  )
}

const DrawerHeader: React.FC<{
  pin: boolean
  closeDrawer: () => void
  togglePin: () => void
}> = ({ pin, closeDrawer, togglePin }) => {
  const theme = useTheme()
  const classes = useStyles({ pin })

  return (
    <div className={classes.drawerHeader}>
      <IconButton onClick={closeDrawer} disabled={pin}>
        {theme.direction !== 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton>

      <IconButton onClick={togglePin}>
        {pin ? <LockIcon /> : <LockOpenIcon />}
      </IconButton>

      <ThemeSwitch />
    </div>
  )
}

export const Drawer: React.FC = ({ children }) => {
  const { open, pin, setOpen, togglePin, whenClickAway } = useDrawer()

  const classes = useStyles({ pin })

  return (
    <ClickAwayListener onClickAway={whenClickAway}>
      <Box>
        <FloatingActionButton show={!open} onClick={setOpen} />

        <MUIDrawer
          open={open}
          anchor="right"
          variant="persistent"
          className={classes.drawer}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <DrawerHeader
            pin={pin}
            togglePin={togglePin}
            closeDrawer={() => setOpen(false)}
          />

          <Divider />
          {children}
        </MUIDrawer>
      </Box>
    </ClickAwayListener>
  )
}
