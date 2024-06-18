const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
    const fetchData = async (url) => {
        try {
            const { data } = await axios.get(url);
            return cheerio.load(data);
        } catch (error) {
            console.error(`Error fetching data from ${url}:`, error);
            return null;
        }
    };

    const scrapeData = async () => {
        const jejuUrl = "https://recruit.jejuair.net/jobinfo/";
        const asianaUrl = "https://flyasiana.recruiter.co.kr/career/recruitment";
        const aeroKUrl = "https://aerok.recruiter.co.kr/career/job";
        const airSeoulMainUrl = 'https://recruit.flyairseoul.com';
        const airSeoulFrameUrl = new URL('default1.asp', airSeoulMainUrl).href;

        const jejuData = await fetchData(jejuUrl).then($ => {
            if (!$) return [];
            return $('table[summary="현재 채용을 진행중인 채용공고 리스트와 접수 시작일, 마감일 입니다"] tr:not(:first-child)').map((i, row) => {
                const columns = $(row).find('td');
                const title = columns.eq(2).find('a').text().trim();
                const day = columns.eq(4).text().trim() + "~" + columns.eq(6).text().trim() || '상시';
                const url = columns.eq(2).find('a').attr('href');
                if (title && day && url) {
                    return { title, day, url };
                }
                return undefined;
            }).get().filter(Boolean);
        });

        const asianaData = await fetchData(asianaUrl).then($ => {
            if (!$) return [];
            return $('a.RecruitList_list-item__RF9iK.RecruitList_TABLET__MsUU5').map((i, el) => {
                const title = $(el).find('.RecruitList_title__nyhAL').text();
                const day = $(el).find('.RecruitList_dday__OelP5').text();
                const url = $(el).attr('href');
                if (title && day) {
                    return { title, day, url };
                }
                return undefined;
            }).get().filter(Boolean);
        });

        const aeroKData = await fetchData(aeroKUrl).then($ => {
            if (!$) return [];
            return $('a.RecruitList_list-item__RF9iK').map((i, el) => {
                const title = $(el).find('.RecruitList_title__nyhAL').text();
                const day = $(el).find('.RecruitList_dday__OelP5').text();
                const url = $(el).attr('href');
                if (title && day) {
                    return { title, day, url };
                }
                return undefined;
            }).get().filter(Boolean);
        });

        const seoulData = await fetchData(airSeoulFrameUrl).then($ => {
            if (!$) return [];
            return $('table[summary="현재 채용을 진행중인 채용공고 리스트와 접수 시작일, 마감일 입니다"] tr:not(:first-child)').map((i, row) => {
                const columns = $(row).find('td');
                const title = columns.eq(2).find('a').text();
                const day = columns.eq(4).text().trim() + "~" + columns.eq(6).text().trim() || '상시';
                const url = columns.eq(2).find('a').attr('href');
                if (title && day && url) {
                    return { title, day, url };
                }
                return undefined;
            }).get().filter(Boolean);
        });

        return {
            '제주': jejuData,
            '아시아나': asianaData,
            '에어로케이': aeroKData,
            '에어서울': seoulData,
            '티웨이': ''  // 티웨이 데이터는 빈 값으로 설정
        };
    };

    try {
        const data = await scrapeData();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
};
