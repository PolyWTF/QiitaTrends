import { Handler, Context, Callback, APIGatewayEvent } from 'aws-lambda'
import axios from 'axios'
import cheerio from 'cheerio'

const takeOutQiitaTrends = (html: string) => {
  const $ = cheerio.load(html)
  const raw = $('div[data-hyperapp-app="Trend"]').attr('data-hyperapp-props')
  if (raw === undefined) return {}
  return JSON.parse(raw).trend.edges
}

interface TrendResponse {
  statusCode: number
  body: string
}

export const handler = (evnet: APIGatewayEvent, context: Context, callback: Callback) => {
  const requestURL = 'https://qiita.com'
  axios.get(requestURL)
  .then(response => {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(takeOutQiitaTrends(response.data))
    })
  })
}
