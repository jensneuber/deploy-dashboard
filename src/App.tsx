import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { useLocalStorage } from "@rehooks/local-storage";
import { Button, Segment, Grid, Header, Container } from 'semantic-ui-react'

import Credentials from './components/Credentials'
import OttiEnv from './components/OttiEnv'
import Platform from './components/Platform'
import Stations from './components/Stations'
import { requestGithubAPI } from './helper/githubAPI'
import Branches from "./components/Branches";

// @ts-ignore-next-line
import Highlight from 'react-highlight.js'

const App: React.FC = () => {
  const [branch, setBranch] = useLocalStorage('branch');
  const [station, setStation] = useState('wdr5');
  const [ottienv, setOttienv] = useState('dev');
  const [ios, setIos] = useState(false);
  const [android, setAndroid] = useState(false);
  const [response, setResponse] = useState();
  const [auth, setAuth] = useState();
  const [error, setError] = useState()

  const request = {
    ref: branch,
    auto_merge: false,
    payload: {
      ottienv: ottienv,
      station: station,
      platform: {
        ios: ios,
        android: android
      }
    }
  }

  const requestDeployment = async () => {
    setError(undefined)

    await requestGithubAPI({
      onError,
      onSuccess: (response) => setResponse(response),
      auth,
      method: 'POST',
      endpoint: 'deployments',
      body: JSON.stringify(request)
    });
  };

  const onError = (error: string) => {
    setError(error)
  }

  return (
    <div className='App'>
      <Container>
        <Grid>
          <Grid.Row columns={ 1 }>
            <Grid.Column>
              <Credentials setAuth={ setAuth } />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={ 1 }>
            <Grid.Column>
              <Branches branch={ branch! } setBranch={ setBranch } auth={ auth } onError={ onError } />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={ 3 }>
            <Grid.Column>
              <Stations station={ station } setStation={ setStation } />
            </Grid.Column>
            <Grid.Column>
              <OttiEnv ottienv={ ottienv } setOttienv={ setOttienv } />
            </Grid.Column>
            <Grid.Column>
              <Platform ios={ ios } android={ android } setIos={ setIos } setAndroid={ setAndroid } />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={ 1 }>
            <Grid.Column>
              <Segment secondary textAlign='right'>
                <Button primary onClick={ () => {
                  requestDeployment()
                } }>Send</Button>
                { response && (
                  <Segment textAlign='left'>
                    Go to <a
                    href={ "https://github.com/WestdeutscherRundfunkKoeln/react-native-wdr-boilerplate/actions" }>
                    https://github.com/WestdeutscherRundfunkKoeln/react-native-wdr-boilerplate/actions
                  </a> to see your action running!
                  </Segment>
                ) }
              </Segment>

            </Grid.Column>
          </Grid.Row>

          { error && (
            <Grid.Row columns={ 1 }>
              <Grid.Column>
                <Segment color={ 'red' }>
                  <Header as={ "h3" }>Error</Header>
                  <Highlight language={ 'json' }>{ error }</Highlight>
                </Segment>
              </Grid.Column>
            </Grid.Row>
          ) }

          <Grid.Row columns={ 2 }>
            <Grid.Column>
              <Segment secondary>
                <Header as={ "h3" }>Request</Header>
                <Highlight language={ 'json' }>
                  { JSON.stringify(request, null, 2) }
                </Highlight>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment secondary>
                <Header as={ "h3" }>Response</Header>
                { response
                  ? (<Highlight language={ 'json' }>{ response }</Highlight>)
                  : 'Send request first ...'
                }
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
}

export default App;
