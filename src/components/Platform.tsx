import React from 'react'
import { Form, Header, Segment } from 'semantic-ui-react'

interface Props {
  ios: boolean
  android: boolean
  setIos: (value: boolean) => void
  setAndroid: (value: boolean) => void
}

const Platform = ({ ios, android, setIos, setAndroid }: Props) => {
  return (
    <Segment>
      <Header as='h3'>
        Platform
      </Header>
      <Form>
        <Form.Group inline>
          <Form.Checkbox
            label={'ios'}
            checked={ios}
            onChange={() => {
              setIos(!ios);
            }}
          />
          <Form.Checkbox
            label={'android'}
            checked={android}
            onChange={() => {
              setAndroid(!android);
            }}
          />
        </Form.Group>
      </Form>
    </Segment>
  );
}

export default Platform

