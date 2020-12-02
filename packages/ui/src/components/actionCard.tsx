import {
  makeStyles,
  Theme,
  Box,
  Card,
  CardContent,
  CardActions,
  Chip,
  Typography,
  IconButton,
  Button,
  Tooltip,
} from '@material-ui/core'
import { Send as SendIcon, Delete as DeleteIcon } from '@material-ui/icons'
import type { MockEvent, Scenario } from '@mocat/interceptor'
import { NOOP } from '../utils'
import { useStore } from '../store'

const useStyles = makeStyles((theme: Theme) => ({
  cardActions: {
    flexWrap: 'wrap',
    padding: theme.spacing(-0.5),
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
}))

export const ActionCard: React.FC<{
  event: MockEvent
  afterHandle?: () => void
}> = ({ event, afterHandle = NOOP }) => {
  const classes = useStyles()
  const { disablePass } = useStore()
  const title =
    'name' in event
      ? event.name ?? 'anonymous'
      : 'rule' in event
      ? event.rule.name ?? 'anonymous'
      : 'anonymous'
  const subTitle =
    'desc' in event ? event.name : 'rule' in event && event.rule.desc

  const Header = () => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          '& > *': (theme) => ({
            marginLeft: theme.spacing(0.5),
            marginRight: theme.spacing(0.5),
          }),
        }}
      >
        <Typography color="textSecondary">{event.type}</Typography>

        {/* tags */}
        {'requestType' in event && (
          <Chip size="small" label={event.requestType} />
        )}
        {'request' in event && (
          <Chip size="small" label={event.request.method} />
        )}
      </Box>

      <Box>
        {'pass' in event && !disablePass && (
          <Tooltip title="pass" placement="top">
            <IconButton
              aria-label="pass"
              size="small"
              onClick={() => {
                event.pass()
                afterHandle()
              }}
            >
              <SendIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        {'reject' in event && (
          <Tooltip title="reject" placement="top">
            <IconButton
              aria-label="reject"
              size="small"
              onClick={() => {
                event.reject()
                afterHandle()
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  )

  return (
    <Card elevation={3}>
      <CardContent>
        <Header />
        <Typography variant="h5" component="h2" noWrap>
          {title}
        </Typography>
        <Typography color="textSecondary" noWrap>
          {subTitle}
        </Typography>
      </CardContent>

      <CardActions className={classes.cardActions} disableSpacing>
        {'rule' in event &&
          event.rule.scenarios &&
          (event.rule.scenarios as Scenario[]).map((scenario) => (
            <Tooltip
              title={scenario.desc ?? ''}
              placement="top"
              key={scenario.name}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  event.resolve(scenario)
                  afterHandle()
                }}
              >
                {scenario.name}
              </Button>
            </Tooltip>
          ))}
      </CardActions>
    </Card>
  )
}
