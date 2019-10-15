import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import Countdown, { zeroPad } from 'react-countdown-now';
import { useParams } from 'react-router-dom';

import Loading from './components/Loading/Loading';
import './timer.css';
import withFirebase from './HOC/withFirebase/withFirebase';
import { subscribeToTimer } from './services/pushes';
import { get } from './services/timer';

function Timer({ firebase }) {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [completed, setCompleted] = useState(false);
  
  useEffect(() => {
    async function load() {
      const timer = await get(id);
      console.log(timer);
      setData(timer);
      if (timer.datetime < Date.now()) {
        setCompleted(true);
      }
    }
  
    const saveToken = async () => {
      const token = await firebase.askForPermissionToReceiveNotifications();
      await subscribeToTimer(token, id);
    };
    try {
      load();
      saveToken();
    } catch (err) {
      console.error(err);
    }
  }, [id]);
  
  if (!data) {
    return <Grid container justify="center"><Loading /></Grid>;
  }
  
  return (
    <Grid container justify="center" alignItems="center" direction="column" spacing={4}>
      <Typography component="p">{data.note}</Typography>
      {completed && <Typography component="p" color="error">{data.finish_message}</Typography>}
      <Countdown
        date={new Date(data.datetime)}
        onComplete={() => setCompleted(true)}
        renderer={({ days, hours, minutes, seconds }) => (
          <div className="timer">
            <div>
              <span>
                {days}
              </span>
              <span className="help-title">days</span>
            </div>
            <div>
              <span>
                {zeroPad(hours, 2)}
              </span>
              <span className="help-title">hours</span>
            </div>
            <div>
              <span>
                {zeroPad(minutes, 2)}
              </span>
              <span className="help-title">minutes</span>
            </div>
            <div>
              <span>
                {zeroPad(seconds, 2)}
              </span>
              <span className="help-title">seconds</span>
            </div>
          </div>
        )}
      />
    </Grid>
  );
}

export default withFirebase(Timer);
