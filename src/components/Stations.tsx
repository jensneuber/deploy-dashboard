import React from 'react'
import { Form, Segment, Header } from 'semantic-ui-react'

interface Props {
  station: string
  setStation: (station: string) => void
}


const Stations = ({ station, setStation }: Props) => {
  const stations = [ 'wdr2', 'wdr5', 'einslive' ]

  return (
    <Segment>
      <Header as={'h3'}>Station</Header>
      <Form>
        <Form.Group inline>
          {
            stations.map(s => {
              return (
                <Form.Radio
                  label={s}
                  type='radio'
                  checked={station === s}
                  onChange={() => {
                    setStation(s);
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

export default Stations

