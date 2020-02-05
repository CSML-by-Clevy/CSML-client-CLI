const axios = require('axios');
const uuid = require('uuid');
const crypto = require('crypto');
require('dotenv').config()

const { CSML_API_CLIENT_KEY, CSML_API_SECRET_KEY } = process.env;

class Api {

  constructor() {
    this.userId = uuid.v4();
  }

  async buildKeys() {
    const UNIX_TIMESTAMP = Math.floor(Date.now() / 1000);
    const XApiKey = `${CSML_API_CLIENT_KEY}|${UNIX_TIMESTAMP}`;
    const signature = crypto.createHmac('sha256', CSML_API_SECRET_KEY)
    .update(XApiKey, 'utf-8')
    .digest('hex');
    const XApiSignature = `sha256=${signature}`;
    return { XApiKey, XApiSignature }
  }

  async getConv(input) {
    const { XApiKey, XApiSignature } = await this.buildKeys();
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
          metadata: {
            firstname: "Bastien",
            lastname: "Botecli"
          },
          request_id: "yaryayryyar",
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