// ==== 1
// import http from 'http'
// import { readFileSync, createReadStream } from 'fs'
// node -e "process.stdout.write(crypto.randomBytes(1e9))" > big.file
// http.createServer((req, res) => {
//   //const file = readFileSync('big.file').toString()
//   //res.write(file)
//   //res.end()
//   createReadStream('big.file')
//     .pipe(res)
// }).listen(3010, () => console.log('running at 3010'))


// ==== 2
// import net from 'net'
// node -e "process.stdin.pipe(require('net').connect(1338))"
// net.createServer(socket => socket.pipe(process.stdout)).listen(1338)

// ==== 3
import { pipeline, Readable, Writable } from 'stream'
import { promisify } from 'util'

const pipelineAsync = promisify(pipeline)
const readableStream = Readable({
  read: function () {
    this.push("Hello something 0")
    this.push("Hello something 1")
    this.push("Hello something 2")
    this.push(null)
  },
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
  writableStream
)
console.log('processo acabou')