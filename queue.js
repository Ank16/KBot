const path = require('node:path');
const fs = require('node:fs');
const youtubesearchapi = require("youtube-search-api");
const ytdl = require('ytdl-core');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

class Queue {
    constructor() {
        this._queue = [];
    }

    async search(searchTerm) {
        const res = await youtubesearchapi.GetListByKeyword(searchTerm, false, 1,[{ type: "video" }]);
        const info = {id : res.items[0].id, title : res.items[0].title, length: res.items[0].length.simpleText}
        return info;
    }

    async addToBackSearch(searchTerm, guildId) {
        const info = await this.search(searchTerm);
        this.addToBack(info);
        this.downloadMp3(info.id, guildId);
        return info.title;
    }
    
    async addToFrontSearch(searchTerm, guildId) {
        const info = await this.search(searchTerm);
        this.addToFront(info);
        await this.downloadMp3(info.id, guildId);
        return info.title;
    }
    
    addToBack(item) {
        this.queue.push(item);
    }

    addToFront(item) {
        this.queue.unshift(item);
    }

    shuffle() {
        let currentIndex = this.queue.length;
        while (currentIndex != 0) {
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [this.queue[currentIndex], this.queue[randomIndex]] = [this.queue[randomIndex], this.queue[currentIndex]];
        }
    }

   async downloadMp3(videoId, guildId) {
        let stream = ytdl(videoId, {
            quality: 'highestaudio',
        });

        const dir = path.join(process.env.MAINPATH, guildId);

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
    
        return new Promise((resolve, reject) => {
            ffmpeg(stream)
            .audioBitrate(128)
            .save(path.join(dir, `${videoId}.mp3`))
            .on('err', (err) => {
                return reject(err);
            })
            .on('end', () => {
                return resolve();
            });
        });
    }

    async getNextFile(guildId) {
        if(this.queue.length==0){
            return null;
        }
        const topItem = this.queue.shift();
        const filepath = path.join(process.env.MAINPATH, guildId, topItem.id + ".mp3");
    
        if(!fs.existsSync(filepath)) {
            await this.downloadMp3(topItem.id);
        }

        fs.renameSync(filepath, path.join(process.env.MAINPATH, guildId, 'playing.mp3'));
            
        return topItem;
    }

    set queue(newQueue) {
        this._queue = newQueue;
    }

    get queue() {
        return this._queue;
    }
}

const queue = new Queue();

module.exports = queue;