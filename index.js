const path = require('path')
const glob = require('glob')
// const child_process = require('child_process')
const shell = require('shelljs')

const videos = glob.sync('./video/**')
videos.forEach((v, k) => {
	if (v.indexOf('.mp4') > -1) {
		console.log(v)
		let videoName = v.replace(/.+\/(.+)\.mp4/g, '$1')
		// let ls = child_process.spawnSync(`ffmpeg -i ${v} -vf delogo=w=300:h=60:x=0:y=0 ./ready/${videoName}.mp4`)
		let data = shell.exec(`ffprobe -v quiet -print_format json -show_streams ${v}`, {silent:true}).stdout
		try {
			data = JSON.parse(data)
		} catch (e) {
			console.log('video error name: ${videoName}')
			return console.log(e)
		}
		let {width, height, duration} = data.streams[0]
		duration = Math.floor(duration - 2)
		let min = Math.floor(duration / 60)
		if (min < 10) {
			min = '0' + min
		} else {
			min = '' + min
		}
		let second = Math.floor(duration % 60)
		if (second < 10) {
			second = '0' + second
		} else {
			second = '' + second
		}
		if (width > 0 && height > 0 && duration > 0) {
			shell.exec(`ffmpeg -i ${v} -loglevel -8 -ss 00:00 -to ${min}:${second} -vf delogo=w=${width}:h=60:x=0:y=0 -y ./ready/${videoName}__${width}x${height}.mp4`)
		}
		/*
		// nologo
		if (width > 0 && height > 0 && duration > 0) {
			shell.exec(`ffmpeg -i ${v} -loglevel -8 -ss 00:00 -to ${min}:${second} -y ./ready/nologo/${videoName}__${width}x${height}.mp4`)
		}
		*/

	}

	// child_process.spawnSync(`ffmpeg -i ./haslogo/W_-lykjYDaYT4_zh.mp4 -vf delogo=w=100:h=100:x=0:y=0:show=1 ./ready/out.mp4`)
	// -ss ${START} -to ${END}
})