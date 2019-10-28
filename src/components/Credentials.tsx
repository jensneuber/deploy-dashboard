import { useLocalStorage } from '@rehooks/local-storage'
import React, { useEffect } from 'react'
import { createAuthString } from '../helper/auth'
import { Segment, Form, Input, Button } from 'semantic-ui-react'

interface Props {
  setAuth: (token?: string) => void
}

const Credentials = ({ setAuth }: Props) => {
  const [ username, setUsername ] = useLocalStorage('username');
  const [ token, setToken, deleteToken ] = useLocalStorage('token');

  useEffect(() => {
    if (token === undefined) {
      setToken('');
    }
  }, [ setToken, token ]);

  useEffect(() => {
    if (username && token && username !== '' && token !== '') {
      const auth = createAuthString(username, token);
      setAuth(auth)
    } else {
      setAuth(undefined)
    }

  }, [ username, token, setAuth ])

  return (
    <Segment>
      <h3>Credentials</h3>
      <Form>
        <Form.Field>
          <label>Username</label>
          <input
            onChange={e => {
              setUsername(e.target.value);
            }}
            value={username || undefined}
          />
        </Form.Field>
        <Form.Field>
          <label>Token</label>
          <Input
            value={token || ''}
            label={token ? (
              <Button onClick={() => {deleteToken();}} size={'small'} color='red'>
                Delete Token
              </Button>
            ) : null}
            labelPosition='right'
            onChange={e => {
              setToken(e.target.value);
            }}
          />
        </Form.Field>
      </Form>
    </Segment>
  );
}

export default Credentials
