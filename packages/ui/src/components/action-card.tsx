import React from 'react'
import {
  makeStyles,
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Button,
  Tooltip,
} from '@material-ui/core'
import { Send as SendIcon, Delete as DeleteIcon } from '@material-ui/icons'
import type { MockEvent } from '@mocat/interceptor'
import { NOOP } from '../utils'
import { useStore } from '../store'
import type { Scene } from '@mocat/interceptor'

const useStyles = makeStyles({
  cardActions: {
    flexWrap: 'wrap',
    padding: -4,
    '& > *': {
      margin: 4,
    },
  },
})

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

  return (
    <Card elevation={3}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography color="textSecondary">{event.type}</Typography>

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

        <Typography variant="h5" component="h2" noWrap>
          {title}
        </Typography>
        <Typography color="textSecondary" noWrap>
          {subTitle}
        </Typography>
      </CardContent>

      <CardActions className={classes.cardActions} disableSpacing>
        {'rule' in event &&
          event.rule.scenes &&
          (event.rule.scenes as Scene[]).map((scene) => (
            <Tooltip title={scene.desc ?? ''} placement="top" key={scene.name}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  event.resolve(scene)
                  afterHandle()
                }}
              >
                {scene.name}
              </Button>
            </Tooltip>
          ))}
      </CardActions>
    </Card>
  )
}
