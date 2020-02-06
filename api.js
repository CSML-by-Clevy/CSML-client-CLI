const axios = require('axios');
const crypto = require('crypto');
const uuidv4 = require('uuid/v4');


class Api {

  constructor(CSML_API_CLIENT_KEY, CSML_API_SECRET_KEY) {
    this.CSML_API_CLIENT_KEY = CSML_API_CLIENT_KEY;
    this.CSML_API_SECRET_KEY = CSML_API_SECRET_KEY;
    this.userId = uuidv4();
  }

  buildKeys() {
    const { CSML_API_CLIENT_KEY, CSML_API_SECRET_KEY } = this;
    const UNIX_TIMESTAMP = Math.floor(Date.now() / 1000);
    const XApiKey = `${CSML_API_CLIENT_KEY}|${UNIX_TIMESTAMP}`;
    const signature = crypto.createHmac('sha256', CSML_API_SECRET_KEY)
    .update(XApiKey, 'utf-8')
    .digest('hex');
    const XApiSignature = `sha256=${signature}`;
    return { XApiKey, XApiSignature }
  }

  async getConv(input) {
    const { XApiKey, XApiSignature } = this.buildKeys();
    return axios({
      method: 'post',
      url: 'https://clients.csml.dev/prod/api/chat',
      headers: {
          'X-Api-Key': XApiKey,
          'X-Api-Signature': XApiSignature,
      },
      data: {
          client: {
            user_id: this.userId
          },
          metadata: {},
          request_id: uuidv4(),
          payload: {
            content: {
              text: input
            },
            content_type: "text"
          }
        }
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log("IMPOSSIBLE TO CONNECT TO CSML STUDIO");
        throw console.error(error);
      });
  }
};


module.exports.Api = Api;
