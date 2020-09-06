import React from 'react'
import {
  makeStyles,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
} from '@material-ui/core'
import type { MockEvent } from '@rabbit-mock/interceptor'
import { SceneButton } from './scene-button'

const useStyles = makeStyles({
  root: {
    // maxWidth: 345,
  },
})

export const ActionCard: React.FC<{ event: MockEvent }> = ({ event }) => {
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
    <Card className={classes.root}>
      <CardContent>
        <Typography color="textSecondary">{event.type}</Typography>
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
        <Typography color="textSecondary">{subTitle}</Typography>
      </CardContent>

      <CardActions>
        {'rule' in event && event.rule.scenes && (
          <SceneButton
            scenes={event.rule.scenes}
            onClick={(scene) => {
              event.resolve(scene)
            }}
          ></SceneButton>
        )}

        {'pass' in event && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              event.pass()
            }}
          >
            Pass
          </Button>
        )}

        {'reject' in event && (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              event.reject()
            }}
          >
            Reject
          </Button>
        )}
      </CardActions>
    </Card>
  )
}
