#!/usr/bin/env node

const fs = require('fs-extra')
const path = require('path')
const {exit} = require('process')

const flagsFolder = './public/images/icons/flags'

async function main() {
  const data = fs.readdirSync(flagsFolder).map(file => file.split('.')[0])

  try {
    await fs.outputJson(path.join(__dirname, '..', 'available-flags.json'), data)
  } catch (err) {
    console.error(err)
  }
}

main().catch(error => {
  console.error(error)
  exit(1)
})

