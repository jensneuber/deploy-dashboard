import { chunk, intersection, uniq } from 'lodash'
import React, { useState, useEffect } from 'react'
import { Segment, Form, Button, Header } from 'semantic-ui-react'

import { requestGithubAPI } from '../helper/githubAPI'

interface Props {
  auth?: string
  branch?: string
  setBranch: (args: any) => void
  onError: (text: string) => void
}

const Branches = ({ auth = '', branch, setBranch, onError }: Props) => {
  const [ branches, setBranches ] = useState([ 'master', 'develop' ]);

  const requestBranches = async () => {
    const response = await requestGithubAPI({
      onError,
      auth,
      method: 'GET',
      endpoint: 'branches'
    });
    const newBranches = response.map((obj: any) => {
      return obj.name;
    });

    const oldBranches = intersection(branches, newBranches);

    setBranches(uniq(oldBranches.concat(newBranches)));
  };

  useEffect(() => {
    if (branch && branch !== '') {
      const newBranches = uniq([ branch ].concat(branches));
      if (newBranches !== branches) {
        setBranches(newBranches);
      }
    }
  }, [setBranches]);

  return (
    <Segment>
      <Segment clearing basic>
        <Button
          primary
          disabled={!auth}
          onClick={() => {
            requestBranches();
          }}
          floated='right'
        >
          Get branches from Github
        </Button>
        <Header as='h3' floated={'left'}>
          Branch
        </Header>
      </Segment>
      <Form>
        <Form.Group inline>
          {chunk(branches, Math.max(6, Math.ceil(branches.length / 3))).map(
            (chunkX, index) => {
              return (
                <Form.Group grouped key={`chunk-${index}`}>
                  {chunkX.map(name => (
                    <Form.Radio
                      label={name}
                      checked={name === branch}
                      key={name}
                      onChange={() => {
                        setBranch(name);
                      }}
                    />
                  ))}
                </Form.Group>
              );
            }
          )}
        </Form.Group>
      </Form>
    </Segment>
  );
}

export default Branches

