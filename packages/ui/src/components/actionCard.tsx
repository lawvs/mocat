import { useState, useEffect } from 'react'
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
  Collapse,
} from '@material-ui/core'
import {
  Send as SendIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
} from '@material-ui/icons'
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
  cardDetail: {
    '& > * + *': {
      marginTop: theme.spacing(1),
    },
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

const HeadersDetail: React.FC<{ headers: Headers }> = ({ headers }) => (
  <Typography>
    {[...headers.entries()].map(([key, value]) => (
      <Typography key={key}>{`${key}: ${value}`}</Typography>
    ))}
  </Typography>
)
const BodyDetail: React.FC<{ body?: string }> = ({ body }) =>
  body ? <Typography>{body}</Typography> : <></>

const NetworkDetail: React.FC<{
  reqOrResp: Request | Response
}> = ({ reqOrResp }) => {
  const classes = useStyles()

  const [body, setBody] = useState<string | undefined>()
  useEffect(() => {
    reqOrResp.clone().text().then(setBody)
  }, [reqOrResp])

  return (
    <CardContent className={classes.cardDetail}>
      <Typography>{`${
        'method' in reqOrResp ? reqOrResp.method : reqOrResp.status
      } ${reqOrResp.url}`}</Typography>
      <HeadersDetail headers={reqOrResp.headers}></HeadersDetail>
      <BodyDetail body={body}></BodyDetail>
    </CardContent>
  )
}

const CardDetail: React.FC<{
  event: MockEvent
}> = ({ event }) => {
  switch (event.type) {
    case 'Run/network/before':
      return <NetworkDetail reqOrResp={event.request}></NetworkDetail>
    case 'Run/network/after':
      if ('response' in event) {
        return <NetworkDetail reqOrResp={event.response}></NetworkDetail>
      }
      if ('error' in event) {
        // TODO error card
        return <></>
      }
    // fallthrough
    default:
      return <></>
  }
}

export const ActionCard: React.FC<{
  event: MockEvent
  afterHandle?: () => void
}> = ({ event, afterHandle = NOOP }) => {
  const classes = useStyles()
  const [expanded, setExpanded] = useState(false)
  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

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

        <IconButton
          className={`${classes.expand} ${expanded ? classes.expandOpen : ''}`}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardDetail event={event} />
      </Collapse>
    </Card>
  )
}
