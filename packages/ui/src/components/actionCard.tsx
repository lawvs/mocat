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
import { useTranslation } from '../i18n'

const useStyles = makeStyles((theme: Theme) => ({
  cardActions: {
    flexWrap: 'wrap',
    padding: theme.spacing(-0.5),
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}))

const TagsHeader: React.FC<{
  event: MockEvent
  afterHandle?: () => void
}> = ({ event, afterHandle = NOOP }) => {
  const { disablePass } = useStore()
  const { t } = useTranslation()

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          // Space Between
          '* + *': (theme) => ({
            marginLeft: theme.spacing(0.5),
          }),
        }}
      >
        {/* Tags */}
        <Chip size="small" label={event.type} />
        {'requestType' in event && (
          <Chip size="small" label={event.requestType} />
        )}
        {'request' in event && (
          <Chip size="small" label={event.request.method} />
        )}
      </Box>

      <Box>
        {'pass' in event && !disablePass && (
          <Tooltip title={t('Pass')} placement="top">
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
          <Tooltip title={t('Reject')} placement="top">
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
}

export const ActionCard: React.FC<{
  event: MockEvent
  afterHandle?: () => void
}> = ({ event, afterHandle = NOOP }) => {
  const classes = useStyles()

  const title =
    'name' in event
      ? event.name ?? 'anonymous'
      : 'rule' in event
      ? event.rule.name ?? 'anonymous'
      : 'anonymous'
  const subTitle =
    'desc' in event ? event.name : 'rule' in event && event.rule.desc

  return (
    <Card elevation={3}>
      <CardContent>
        <TagsHeader event={event} afterHandle={afterHandle} />
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
