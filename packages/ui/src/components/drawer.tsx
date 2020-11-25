import React from 'react'
import {
  makeStyles,
  useTheme,
  Box,
  Fab,
  Badge,
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

import {
  useAutoResponder,
  useDrawer,
  useMockEventLength,
  useThemeSwitch,
} from '../store'

const drawerWidth = 400

const useStyles = makeStyles<Theme, { marginBody?: boolean }>(
  (theme: Theme) => ({
    '@global': {
      html: {
        marginRight: ({ marginBody = false }) => marginBody && drawerWidth,
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
      'max-width': '100vw',
      flexShrink: 0,
    },
    drawerPaper: {
      'overflow-x': 'hidden',
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
  const eventCnt = useMockEventLength()

  return (
    <Zoom in={show}>
      <Fab
        className={classes.fab}
        color={autoResponseEnable ? 'secondary' : 'primary'}
        variant="extended"
        aria-label="mock"
        onClick={onClick}
      >
        <Badge badgeContent={eventCnt} color="secondary">
          <BuildIcon className={classes.fabExtendedIcon} />
        </Badge>
        Mocat
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
  open: boolean
  pin: boolean
  closeDrawer: () => void
  togglePin: () => void
}> = ({ open, pin, closeDrawer, togglePin }) => {
  const theme = useTheme()
  const classes = useStyles({ marginBody: pin && open })

  return (
    <div className={classes.drawerHeader}>
      <IconButton onClick={closeDrawer}>
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

  const classes = useStyles({ marginBody: pin && open })

  return (
    <ClickAwayListener onClickAway={whenClickAway}>
      <Box>
        <FloatingActionButton show={!open} onClick={() => setOpen()} />

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
            open={open}
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
