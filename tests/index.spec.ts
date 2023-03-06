import { App } from 'koishi'
import { expect, use } from 'chai'
import mock from '@koishijs/plugin-mock'
import * as jest from 'jest-mock'
import * as recall from '../src'
import shape from 'chai-shape'

use(shape)

const app = new App()

app.plugin(mock)
app.plugin(recall)

const client = app.mock.client('123', '456')

before(() => app.start())

describe('koishi-plugin-recall', () => {
  it('basic support', async () => {
    const del = app.bots[0].deleteMessage = jest.fn(async () => {})
    await client.shouldReply('recall', '近期没有发送消息。')
    const session = app.bots[0].session({ messageId: '1234', channelId: '456', guildId: '456', type: 'send' })
    app.mock.receive(session)
    await client.shouldNotReply('recall')
    expect(del.mock.calls).to.have.shape([[client.meta.channelId, '1234']])
  })

  it('reply', async () => {
    const del = app.bots[0].deleteMessage = jest.fn(async () => {})
    const session = app.bots[0].session({ messageId: '114', channelId: '514', guildId: '1919', type: 'message' })
    app.mock.receive(session)
    await client.shouldNotReply('<quote id="114"/>recall')
    expect(del.mock.calls).to.have.shape([[client.meta.channelId, '114']])
  })
})
