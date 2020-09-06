import React from 'react'
import styled from 'styled-components'
import {
  makeStyles,
  useTheme,
  createStyles,
  Drawer as MUIDrawer,
  Divider,
} from '@material-ui/core'
import type { Theme } from '@material-ui/core/styles/createMuiTheme'
import IconButton from '@material-ui/core/IconButton/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'

const ToggleButton = styled.button`
  position: fixed;
  right: 0;
  top: 50%;
  transform: translate(0, -50%);
  border-radius: 8px 0 0 8px;

  background-color: #d4d4d4;
  width: 30px;
  height: 80px;
  border: none;
  outline: none;
  cursor: pointer;
  transition: all 225ms;
  opacity: 0.7;
  box-shadow: rgba(118, 118, 118, 0.1) -1px 3px 1px 0px;

  &:active {
    transform-origin: right;
    transform: translate(0, -50%) scale(1.1);
  }

  &:hover {
    opacity: 1;
    box-shadow: rgba(118, 118, 118, 0.2) -1px 3px 3px 0px;
  }
`

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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

  const toggleDrawer = () => {
    setOpen(!open)
  }

  return (
    <>
      <ToggleButton onClick={toggleDrawer}></ToggleButton>
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
    </>
  )
}
