// FROM: https://www.youtube.com/watch?v=pB5-QzabL2I
import { pipeline, Readable, Writable, Transform } from 'stream'
import { promisify } from 'util'
import { createWriteStream } from 'fs'

const pipelineAsync = promisify(pipeline)

const readableStream = Readable({
  read() {
    for ( let index = 0; index < 1e5; index++) {
      const person = { id: Date.now() + index, name: `Matheus-${index}` }
      const data = JSON.stringify(person)
      this.push(data)
    }
    // end data
    this.push(null)
  }
})

const writableMaptoCSV = Transform({
  transform(chunk, encoding, cb) {
    const data = JSON.parse(chunk)
    const result = `${data.id},${data.name.toUpperCase()}\n`
    cb(null, result)
  }
})

const setHeader = Transform({
  transform(chunk, encoding, cb) {
    this.counter = this.counter ?? 0
    if (this.counter) {
      return cb(null, chunk)
    }
    this.counter += 1
    cb(null, "id,name\n".concat(chunk))
  }
})

const writableStream = Writable({
  write (chunk, encoding, cb) {
    console.log('msg', chunk.toString())
    cb()
  }
})

await pipelineAsync(
  readableStream,
  // process.stdout
  // writableStream,
  writableMaptoCSV,
  setHeader,
  // process.stdout,
  createWriteStream('my.csv')
)
console.log('processo acabou')