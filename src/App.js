import React, { useState, useEffect } from 'react';
import './App.css';
import { uniq, chunk, intersection } from 'lodash';
import { useLocalStorage } from '@rehooks/local-storage';

function App() {
  // const [username, setUsername] = useState('jensneuber');
  // const [token, setToken] = useState(
  //   'b179314a2b0d883bda5efaafa9623dcd9a44d11a'
  // );
  const [branches, setBranches] = useState(['master', 'develop']);
  const [branch, setBranch] = useLocalStorage('branch');
  const [station, setStation] = useState('wdr5');
  const [ottienv, setOttienv] = useState('dev');
  const [ios, setIos] = useState(false);
  const [android, setAndroid] = useState(false);
  const [response, setResponse] = useState();
  const [username, setUsername] = useLocalStorage('username');
  const [token, setToken, deleteToken] = useLocalStorage('token');
  const [shouldStore, setShouldStore] = useLocalStorage('shouldStore');

  const createAuth = (u, t) => {
    return btoa(`${u}:${t}`);
  };

  const auth = createAuth(username, token);

  useEffect(() => {
    if (token === undefined) {
      setToken('');
    }
  }, [setToken, token]);

  useEffect(() => {
    if (branch && branch !== '') {
      const newBranches = uniq([branch].concat(branches));
      if (newBranches !== branches) {
        setBranches(newBranches);
      }
    }
  }, []);

  const requestDeployment = async () => {
    await requestGithubAPI({
      method: 'POST',
      endpoint: 'deployments',
      body: JSON.stringify({
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
      })
    });

    !shouldStore && deleteToken();
  };

  const requestBranches = async () => {
    const response = await requestGithubAPI({
      method: 'GET',
      endpoint: 'branches'
    });

    const newBranches = response.map(obj => {
      return obj.name;
    });

    const oldBranches = intersection(branches, newBranches);

    setBranches(uniq(oldBranches.concat(newBranches)));
  };

  const requestGithubAPI = async ({ body, endpoint, method }) => {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${auth}`
      }
    };

    if (body) {
      options.body = body;
    }

    const fetchResponse = await fetch(
      `https://api.github.com/repos/WestdeutscherRundfunkKoeln/react-native-wdr-boilerplate/${endpoint}`,
      options
    );

    const response = await fetchResponse.json();

    setResponse(response);

    return response;
  };

  return (
    <div className='App'>
      <div>
        <div>
          <label>
            Username
            <input
              onChange={e => {
                setUsername(e.target.value);
              }}
              value={username}
            />
          </label>
        </div>
        <div>
          <label>
            Token
            <input
              value={token || ''}
              onChange={e => {
                setToken(e.target.value);
              }}
            />
            {token && token !== '' && (
              <button
                onClick={() => {
                  deleteToken();
                }}
              >
                Delete token
              </button>
            )}
          </label>
        </div>
        <div>
          <label>Store token?</label>{' '}
          <input
            type='checkbox'
            checked={shouldStore}
            onChange={e => {
              setShouldStore(e.target.checked);
            }}
          />
        </div>
      </div>
      <div>
        <div>
          <h3>Branches</h3>
          <button
            onClick={() => {
              requestBranches();
            }}
          >
            Get branches
          </button>
        </div>
        <div style={{ flex: 1, flexDirection: 'row' }}>
          {chunk(branches, Math.max(6, Math.ceil(branches.length / 3))).map(
            (chunkX, index) => {
              return (
                <div style={{ display: 'inline-block' }} key={'chunk-' + index}>
                  {chunkX.map(name => (
                    <div key={name}>
                      <label>
                        {name}{' '}
                        <input
                          type='radio'
                          checked={name === branch}
                          onChange={() => {
                            setBranch(name);
                          }}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              );
            }
          )}
        </div>
      </div>
      <div style={{ flex: 1, flexDirection: 'row' }}>
        <h3>Station</h3>
        <div className='radioInput'>
          <label>
            WDR2
            <input
              type='radio'
              name='station'
              value='wdr2'
              checked={station === 'wdr2'}
              onChange={() => {
                setStation('wdr2');
              }}
            />
          </label>
        </div>
        <div className='radioInput'>
          <label>
            WDR5
            <input
              type='radio'
              name='station'
              value='wdr5'
              checked={station === 'wdr5'}
              onChange={() => {
                setStation('wdr5');
              }}
            />
          </label>
        </div>
        <div className='radioInput'>
          <label>
            Einslive
            <input
              type='radio'
              name='station'
              value='einslive'
              checked={station === 'einslive'}
              onChange={() => {
                setStation('einslive');
              }}
            />
          </label>
        </div>
      </div>
      <div style={{ flex: 1, flexDirection: 'row' }}>
        <h3>Otti Env</h3>
        <div className='radioInput'>
          <label>
            DEV
            <input
              type='radio'
              name='ottienv'
              value='dev'
              checked={ottienv === 'dev'}
              onChange={() => {
                setOttienv('dev');
              }}
            />
          </label>
        </div>
        <div className='radioInput'>
          <label>
            STAGE
            <input
              type='radio'
              name='ottienv'
              value='stage'
              checked={ottienv === 'stage'}
              onChange={() => {
                setOttienv('stage');
              }}
            />
          </label>
        </div>
        <div className='radioInput'>
          <label>
            LIVE
            <input
              type='radio'
              name='ottienv'
              value='live'
              checked={ottienv === 'live'}
              onChange={() => {
                setOttienv('live');
              }}
            />
          </label>
        </div>
      </div>

      <div style={{ flex: 1, flexDirection: 'row' }}>
        <h3>Platform</h3>
        <div className='radioInput'>
          <label>
            iOS
            <input
              type='checkbox'
              checked={ios}
              onChange={() => {
                setIos(!ios);
              }}
            />
          </label>
        </div>
        <div className='radioInput'>
          <label>
            Android
            <input
              type='checkbox'
              checked={android}
              onChange={() => {
                setAndroid(!android);
              }}
            />
          </label>
        </div>
      </div>

      <div>
        <button
          onClick={() => {
            requestDeployment();
          }}
        >
          Send
        </button>
      </div>

      <div>
        <h3>Result</h3>
        <pre>{auth}</pre>
        <pre>
          {JSON.stringify(
            {
              ref: 'github-actions',
              auto_merge: false,
              payload: {
                ottienv: ottienv,
                station: station,
                platform: {
                  ios: ios,
                  android: android
                }
              }
            },
            null,
            2
          )}
        </pre>
      </div>
      <div>
        <h3>Response</h3>
        <pre>{JSON.stringify(response, null, 2)}</pre>
        <pre>{response && JSON.stringify(response.headers, null, 2)}</pre>
      </div>
    </div>
  );
}

export default App;
