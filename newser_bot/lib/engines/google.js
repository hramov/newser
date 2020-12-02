'use strict'

import _ from 'underscore'
import axios from 'axios'
import { parseString } from 'xml2js'
import { log } from '../core/utils'

import WSW from '../core/struct/wsw'

export default class Google extends WSW {

    constructor(singleQueryData) {
        super(singleQueryData, singleQueryData.config.engines.google)
        this.singleQueryData = singleQueryData
    }

    async index() {
        let pageFunc = async(News_array) => {
            News_array.splice(0, 34);
            for (let i = 0; i < News_array.length; i++) {
                try {
                    News_array[i].href = News_array[i].href.split('/')[2];
                    News_array[i].href = Buffer.from(News_array[i].href, 'base64').toString('utf-8');
                    let url = News_array[i].href.split('//')[1];
                    url = url.replace(/[^0-9A-Za-zА-Яа-яЁё:\/\\?#_.-]/g, "").replace(/^0-9A-Za-zА-Яа-яЁё+|https:$/g, "");
                    News_array[i].href = 'https://' + url;
                } catch (e) {
                    delete News_array[i];
                }
            }
            News_array = News_array.filter(function(el) {
                return el != null;
            });
            return _.flatten(News_array);
        }
        return await super.index(pageFunc);
    }

    async getRSS() {
        let News_array = []
        let url = `https://news.google.com/rss/search?q=${encodeURI(this.singleQueryData.query)}&hl=ru&gl=RU&ceid=RU:ru`
        log(decodeURI(url))

        await axios.get(url)
            .then((response) => {
                parseString(response.data, (err, result) => {
                    if (!err && result.rss) {
                        const items = result.rss.channel[0].item
                        for (let i = 0; i < items.length; i++) {
                            let News = new Object({
                                title: "",
                                desc: "",
                                agency: "",
                                href: "",
                                date: "",
                                content: "",
                                lead_img: "",
                                sentimental: '',
                                id_request: this.singleQueryData.id_request,
                                id_engine: this.singleQueryData.id_engine
                            });
                            News.title = items[i].title.join()
                            News.desc = items[i].description.join().split('>')[1].split('<')[0]
                            News.agency = items[i].source[0]._
                            News.href = decodeURI(items[i].link.join())
                            News.date = items[i].pubDate.join()
                            News_array.push(News)
                        }
                    } else {
                        return []
                    }
                });
            })
        return News_array
    }
}