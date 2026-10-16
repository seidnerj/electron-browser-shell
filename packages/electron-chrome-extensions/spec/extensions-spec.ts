import { expect } from 'chai'
import * as path from 'node:path'
import { session } from 'electron'
import { ElectronChromeExtensions } from '../'

describe('Extensions', () => {
  const testSession = session.fromPartition('test-extensions')
  const extensions = new ElectronChromeExtensions({
    license: 'internal-license-do-not-use' as any,
    session: testSession,
  })

  it('retrieves the instance with fromSession()', () => {
    expect(ElectronChromeExtensions.fromSession(testSession)).to.equal(extensions)
  })

  it('registers the preload shipped with this package', () => {
    const ownPreload = path.resolve(__dirname, '..', 'dist', 'chrome-extension-api.preload.js')
    const preloads = testSession.getPreloadScripts().map((script) => script.filePath)
    expect(preloads).to.include(ownPreload)
    expect(
      preloads.filter((file) => file.endsWith('chrome-extension-api.preload.js')),
    ).to.deep.equal([ownPreload, ownPreload])
  })

  it('throws when two instances are created for session', () => {
    expect(() => {
      new ElectronChromeExtensions({
        license: 'internal-license-do-not-use' as any,
        session: testSession,
      })
    }).to.throw()
  })
})
