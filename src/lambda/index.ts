import { Handler, Context, Callback, APIGatewayEvent } from 'aws-lambda'
import axios from 'axios'
import cheerio from 'cheerio'

const takeOutQiitaTrends = (html: string) => {
  const $ = cheerio.load(html)
  const raw = $('div[data-hyperapp-app="Trend"]').attr('data-hyperapp-props')
  if (raw === undefined) return {}
  return format(JSON.parse(raw).trend.edges)
}

const format = (object: QiitaTrend[]) => {
  let formattedArray = []
  formattedArray = object.map(fetchedObject => {
    return {
      createdAt: fetchedObject.node.createdAt,
      likesCount: fetchedObject.node.likesCount,
      title: fetchedObject.node.title,
      id: fetchedObject.node.uuid,
      user: {
        profileImageUrl: fetchedObject.node.author.profileImageUrl,
        name: fetchedObject.node.author.urlName
      }
    }
  })
  return formattedArray
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

export interface QiitaTrend {
  followingLikers: any[],
  isLikedByViewer: boolean,
  isNewArrival: boolean,
  hasCodeBlock: boolean,
  node: QiitaTrendNode
}

interface QiitaTrendNode {
  createdAt: string
  likesCount: number
  title: string
  uuid: string
  author: QiitaTrendAuthor
}

interface QiitaTrendAuthor {
  profileImageUrl: string
  urlName: string
}