interface RequestGithubAPI {
  auth: string
  method: string
  body?: any
  endpoint?: string
  onError?: (text: string) => void
  onSuccess?: (text: string) => void
}


export const requestGithubAPI = async ({ auth, body, endpoint, method, onError, onSuccess }: RequestGithubAPI) => {
  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${ auth }`
    },

    body: undefined
  };

  if (body) {
    options.body = body;
  }

  const fetchResponse = await fetch(
    `https://api.github.com/repos/WestdeutscherRundfunkKoeln/react-native-wdr-boilerplate/${ endpoint }`,
    options
  );

  const response = await fetchResponse.json();

  if (fetchResponse.status > 320) {
    onError && onError(`Status: ${ fetchResponse.status } | Response ${ JSON.stringify(response, null, 2) }`)
  } else {
    onSuccess && onSuccess(`Status: ${ fetchResponse.status } | Response ${ JSON.stringify(response, null, 2) }`)
  }

  return response;
};
