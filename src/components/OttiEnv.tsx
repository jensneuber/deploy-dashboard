import React from 'react'
import { Form, Header, Segment } from 'semantic-ui-react'

interface Props {
  ottienv?: string
  setOttienv: any
}

const OttiEnv = ({ ottienv, setOttienv }: Props) => {

  const ottiEnvs = [ 'dev', 'stage', 'live' ]

  return (
    <Segment>
      <Header as='h3'>
        Otti Env
      </Header>
      <Form>
        <Form.Group inline>
          {
            ottiEnvs.map(env => {
              return (
                <Form.Radio
                  label={env}
                  key={env}
                  checked={ottienv === env}
                  onChange={() => {
                    setOttienv(env);
                  }}
                />
              )
            })
          }
        </Form.Group>
      </Form>
    </Segment>
  );
}

export default OttiEnv

