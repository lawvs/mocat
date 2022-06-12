import type { MockEvent } from '@mocat/interceptor'
import {
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Send as SendIcon,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Collapse,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from '../i18n'
import { useMockEvent } from '../store'

const TagsHeader = ({ event }: { event: MockEvent }) => {
  const { t } = useTranslation()
  const { passEvent, rejectEvent } = useMockEvent(event)

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
        {passEvent && (
          <Tooltip title={t('Pass')} placement="top">
            <IconButton
              aria-label="pass"
              size="small"
              onClick={() => passEvent()}
            >
              <SendIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        {rejectEvent && (
          <Tooltip title={t('Reject')} placement="top">
            <IconButton
              aria-label="reject"
              size="small"
              onClick={() => rejectEvent()}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  )
}

const HeadersDetail = ({ headers }: { headers: Headers }) => (
  <Typography>
    {[...headers.entries()].map(([key, value]) => (
      <Typography key={key}>{`${key}: ${value}`}</Typography>
    ))}
  </Typography>
)
const BodyDetail = ({ body }: { body?: string }) =>
  body ? <Typography>{body}</Typography> : <></>

const NetworkDetail = ({ reqOrResp }: { reqOrResp: Request | Response }) => {
  const [body, setBody] = useState<string | undefined>()
  useEffect(() => {
    reqOrResp.clone().text().then(setBody)
  }, [reqOrResp])

  return (
    <CardContent>
      <Typography>{`${
        'method' in reqOrResp ? reqOrResp.method : reqOrResp.status
      } ${reqOrResp.url}`}</Typography>
      <HeadersDetail headers={reqOrResp.headers}></HeadersDetail>
      <BodyDetail body={body}></BodyDetail>
    </CardContent>
  )
}

const CardDetail = ({ event }: { event: MockEvent }) => {
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

export const ActionCard = ({ event }: { event: MockEvent }) => {
  const [expanded, setExpanded] = useState(false)
  const { resolveEvent } = useMockEvent(event)
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
        <TagsHeader event={event} />
        <Typography variant="h5" component="h2" noWrap>
          {title}
        </Typography>
        <Typography color="textSecondary" noWrap>
          {subTitle}
        </Typography>
      </CardContent>

      <CardActions
        sx={{
          flexWrap: 'wrap',
          padding: (theme) => theme.spacing(-0.5),
        }}
        disableSpacing
      >
        {resolveEvent &&
          'rule' in event &&
          Array.from(event.rule.scenarios).map((scenario) => (
            <Tooltip
              sx={{ margin: (theme) => theme.spacing(0.5) }}
              title={scenario.desc ?? ''}
              placement="top"
              key={scenario.name}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => resolveEvent(scenario)}
              >
                {scenario.name}
              </Button>
            </Tooltip>
          ))}

        <IconButton
          sx={[
            {
              transform: 'rotate(0deg)',
              marginLeft: 'auto',
              transition: (theme) =>
                theme.transitions.create('transform', {
                  duration: theme.transitions.duration.shortest,
                }),
            },
            expanded && { transform: 'rotate(180deg)' },
          ]}
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
