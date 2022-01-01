import {
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  Build as BuildIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
} from '@mui/icons-material'
import {
  Badge,
  Box,
  ClickAwayListener,
  Divider,
  Drawer as MUIDrawer,
  Fab,
  GlobalStyles,
  IconButton,
  useTheme,
  Zoom,
} from '@mui/material'
import {
  useAutoResponder,
  useDrawer,
  useMockEventLength,
  useStore,
  useThemeSwitch,
} from '../store'

const drawerWidth = 400

const FloatingActionButton = ({
  show,
  onClick,
}: {
  show: boolean
  onClick: () => void
}) => {
  const { brandTitle } = useStore()
  const { enable: autoResponseEnable } = useAutoResponder()
  const eventCnt = useMockEventLength()

  return (
    <Zoom in={show}>
      <Fab
        sx={{
          position: 'fixed',
          bottom: (theme) => theme.spacing(2),
          right: (theme) => theme.spacing(2),
          zIndex: 999999,
        }}
        color={autoResponseEnable ? 'secondary' : 'primary'}
        variant="extended"
        aria-label="mock"
        onClick={onClick}
      >
        <Badge badgeContent={eventCnt} color="secondary">
          <BuildIcon
            sx={{
              marginRight: (theme) => theme.spacing(1),
            }}
          />
        </Badge>
        {brandTitle}
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

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
      }}
    >
      <IconButton onClick={closeDrawer}>
        {theme.direction !== 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton>

      <IconButton onClick={togglePin}>
        {pin ? <LockIcon /> : <LockOpenIcon />}
      </IconButton>

      <ThemeSwitch />
    </Box>
  )
}

export const Drawer: React.FC = ({ children }) => {
  const { open, pin, setOpen, togglePin, whenClickAway } = useDrawer()
  return (
    <>
      <GlobalStyles
        styles={
          {
            html: {
              marginRight: pin && open ? drawerWidth : null,
            },
          } as any
        }
      />
      <ClickAwayListener onClickAway={whenClickAway}>
        <Box>
          <FloatingActionButton show={!open} onClick={() => setOpen()} />

          <MUIDrawer
            open={open}
            anchor="right"
            variant="persistent"
            sx={{
              '& .MuiDrawer-paper': {
                overflowX: 'hidden',
                width: drawerWidth,
                maxWidth: '90vw',
                flexShrink: 0,
              },
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
    </>
  )
}
