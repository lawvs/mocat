import React from 'react'
import {
  makeStyles,
  useTheme,
  createStyles,
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
import Box from '@material-ui/core/Box/Box'

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

export const Drawer: React.FC = ({ children }) => {
  const [open, setOpen] = React.useState(false)

  const classes = useStyles()
  const theme = useTheme()

  const toggleDrawer = () => setOpen(!open)
  const handleClickAway = () => setOpen(false)

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box>
        {/* Floating action button */}
        <Zoom in={!open}>
          <Fab
            className={classes.fab}
            color="primary"
            variant="extended"
            aria-label="mock"
            onClick={toggleDrawer}
          >
            <BuildIcon className={classes.fabExtendedIcon} />
            Mock
          </Fab>
        </Zoom>

        <MUIDrawer open={open} anchor="right" variant="persistent">
          <div className={classes.drawerHeader}>
            <IconButton onClick={toggleDrawer}>
              {theme.direction !== 'ltr' ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </div>
          <Divider />
          {children}
        </MUIDrawer>
      </Box>
    </ClickAwayListener>
  )
}
