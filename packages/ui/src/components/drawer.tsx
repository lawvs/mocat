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
} from '@material-ui/core'
import type { Theme } from '@material-ui/core/styles/createMuiTheme'
import IconButton from '@material-ui/core/IconButton/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import BuildIcon from '@material-ui/icons/Build'
import LockIcon from '@material-ui/icons/Lock'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import DarkIcon from '@material-ui/icons/Brightness4'
import LightIcon from '@material-ui/icons/Brightness7'

import { useDispatch } from '../store'

const drawerWidth = 400

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  const classes = useStyles()

  return (
    <Zoom in={show}>
      <Fab
        className={classes.fab}
        color="primary"
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
  const dispatch = useDispatch()
  const theme = useTheme()
  const themeType = theme.palette.type

  return (
    <IconButton
      onClick={() =>
        dispatch({
          type: 'UPDATE',
          payload: { theme: themeType === 'light' ? 'dark' : 'light' },
        })
      }
    >
      {themeType === 'light' ? <DarkIcon /> : <LightIcon />}
    </IconButton>
  )
}

export const Drawer: React.FC = ({ children }) => {
  const [open, setOpen] = React.useState(false)
  const [pin, setPin] = React.useState(false)

  const theme = useTheme()
  const classes = useStyles()

  const toggleDrawer = () => !pin && setOpen(!open)
  const handleClickAway = () => !pin && setOpen(false)
  const togglePin = () => setPin(!pin)

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box>
        <FloatingActionButton show={!open} onClick={toggleDrawer} />

        <MUIDrawer
          open={open}
          anchor="right"
          variant="persistent"
          className={classes.drawer}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          {/* Header */}
          <div className={classes.drawerHeader}>
            <IconButton onClick={toggleDrawer} disabled={pin}>
              {theme.direction !== 'ltr' ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>

            <IconButton onClick={togglePin}>
              {pin ? <LockIcon /> : <LockOpenIcon />}
            </IconButton>

            <ThemeSwitch />
          </div>

          <Divider />
          {children}
        </MUIDrawer>
      </Box>
    </ClickAwayListener>
  )
}
