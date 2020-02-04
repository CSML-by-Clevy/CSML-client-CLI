const axios = require('axios');
const uuid = require('uuid');
const crypto = require('crypto');
require('dotenv').config()

const { CSML_API_CLIENT_KEY, CSML_API_SECRET_KEY } = process.env;

class Api {

  constructor() {
    this.userId = uuid.v4();
  }

  buildKeys() {
    const UNIX_TIMESTAMP = Math.floor(Date.now() / 1000);
    const XApiKey = `${CSML_API_CLIENT_KEY}|${UNIX_TIMESTAMP}`;
    const signature = crypto.createHmac('sha256', CSML_API_SECRET_KEY)
    .update(XApiKey, 'utf-8')
    .digest('hex');
    const XApiSignature = `sha256=${signature}`;
    return { XApiKey, XApiSignature }
  }

  getConv(input) {
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
        console.log('response', response.data);
      })
      .catch(error => {
        console.log('error', error.response);
      });
  }
};


module.exports.Api = Api;