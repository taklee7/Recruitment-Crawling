require('dotenv').config();
const puppeteer = require('puppeteer');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const UPDATE_INTERVAL = 25 * 60 * 1000; // 25분을 밀리초로 표현

app.use(cors());
app.use(express.json());

async function scrapeData() {
    let browser;
    try {
        browser = await puppeteer.launch({
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath(),
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });
const page = await browser.newPage();

    // 제주 사이트 방문
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');
    await page.goto("https://recruit.jejuair.net/jobinfo/");

    // 요소가 로드될 때까지 대기
    try {
        // 기존 셀렉터를 좀 더 명확한 것으로 수정
        await page.waitForSelector("table[summary='현재 채용을 진행중인 채용공고 리스트와 접수 시작일, 마감일 입니다']");
    } catch (e) {
        console.error('셀렉터를 찾는 동안 오류가 발생했습니다:', e);
    }

    // 수정된 셀렉터를 사용하여 정보 추출
    const jejuData = await page.$$eval(
        'table[summary="현재 채용을 진행중인 채용공고 리스트와 접수 시작일, 마감일 입니다"] tr:not(:first-child)',
        rows => {
            return rows.map(row => {
                const columns = row.querySelectorAll('td');
                const title = columns[2]?.querySelector('a')?.innerText.trim(); // 세 번째 열의 a 태그 내용
                const day = columns[4]?.innerText.trim() + "~" + columns[6]?.innerText.trim() || '상시'; // 일곱 번째 열, 상시인 경우 '상시'로 표시
                const url = columns[2]?.querySelector('a')?.href; // a 태그의 href
                if (title && day && url) {
                    return { title, day, url };
                }
                return undefined;
            }).filter(Boolean); // undefined 항목 제거
          });

    // 아시아나 사이트 방문
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');
    await page.goto("https://flyasiana.recruiter.co.kr/career/recruitment");
    // 요소가 로드될 때까지 대기
    try { 
      await page.waitForSelector(".RecruitList_recruit-list__cjKzb.RecruitList_TABLET__MsUU5");
    } catch (e) {
        console.error('셀렉터를 찾는 동안 오류가 발생했습니다:', e);
    }
    // 아시아나 정보 추출
    const asianaData = (await page.$$eval('a.RecruitList_list-item__RF9iK.RecruitList_TABLET__MsUU5', elements => elements.map(el => {
            const title = el.querySelector('.RecruitList_title__nyhAL')?.innerText;
            const day = el.querySelector('.RecruitList_dday__OelP5')?.innerText;
            const url = el.href;
            // 요소가 null이 아닌 경우에만 객체 반환
            if (title && day) {
                return { title, day, url };
            }
            // 요소가 null인 경우, 삭제(또는 적절한 오류 처리)
            return undefined;
        }))).filter(Boolean); // undefined 항목 제거

    // 에어로케이 사이트 방문
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');
    await page.goto("https://aerok.recruiter.co.kr/career/job");
        // 요소가 로드될 때까지 대기
        try { 
            await page.waitForSelector(".RecruitList_recruit-list__cjKzb");
        } catch (e) {
            console.error('셀렉터를 찾는 동안 오류가 발생했습니다:', e);
        }
        // 에어로케이 정보 추출
        const aeroKData = (await page.$$eval('a.RecruitList_list-item__RF9iK', elements => elements.map(el => {
    // 클래스 선택자 수정: 공백 대신 점(.)을 사용하여 클래스 연결
    const e = el.querySelector('.Tag_tag__bUcI4.Tag_secondary__MtMwp.Tag_gray__SaQx_.Tag_lg__GwiBw.RecruitList_submission-status-tag__VGC47')?.innerText;
    const title = el.querySelector('.RecruitList_title__nyhAL')?.innerText;
    const day = el.querySelector('.RecruitList_dday__OelP5')?.innerText;
    const url = el.href;
    // 요소가 null이 아닌 경우에만 객체 반환
    if (title && day) {
        return { title, day, url };
    }
    // 요소가 null인 경우, 삭제(또는 적절한 오류 처리)
    return undefined;
}))).filter(Boolean); // undefined 항목 제거


    // 에어서울 사이트 방문
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');
const mainUrl = 'https://recruit.flyairseoul.com';
await page.goto(mainUrl, {waitUntil: 'networkidle0'});

// frame의 src 속성 값을 기반으로 URL을 구성합니다.
const frameUrl = new URL('default1.asp', mainUrl).href;

// frame URL로 직접 이동합니다.
await page.goto(frameUrl, {waitUntil: 'networkidle0'});

try { 
  await page.waitForSelector("table[summary='현재 채용을 진행중인 채용공고 리스트와 접수 시작일, 마감일 입니다']");
} catch (e) {
    console.error('셀렉터를 찾는 동안 오류가 발생했습니다:', e);
}

const seoulData = await page.$$eval('table[summary="현재 채용을 진행중인 채용공고 리스트와 접수 시작일, 마감일 입니다"] tr:not(:first-child)', rows => {
  return rows.map(row => {
    const columns = row.querySelectorAll('td');
    const title = columns[2]?.querySelector('a')?.innerText; // 세 번째 열의 a 태그 내용
    const day = columns[4]?.innerText + "~" + columns[6]?.innerText.trim() || '상시'; // 일곱 번째 열, 상시인 경우 '상시'로 표시
    const url = columns[2]?.querySelector('a')?.href; // 세 번째 열의 a 태그의 href
    if (title && day && url) {
      return { title, day, url };
    }
    return undefined;
  }).filter(Boolean); // undefined 항목 제거
});
    
// 정보 출력 대신 데이터 반환
return {
    '제주': jejuData,
    '아시아나': asianaData,
    '에어로케이': aeroKData,
    '에어서울': seoulData,
    '티웨이': ''
};
} catch (error) {
    console.error("Error scraping data:", error);
    return null;
} finally {
    if (browser) {
        await browser.close();
    }
}
}

app.get('/scrape', async (req, res) => {
try {
    const data = await scrapeData();
    if (data) {
        res.status(200).json(data);
    } else {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
} catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
}
});

// 데이터를 주기적으로 업데이트하는 함수
let cachedData = null;

async function updateDataPeriodically() {
try {
    const data = await scrapeData();
    if (data) {
        cachedData = data;
        console.log("Data updated successfully.");
    } else {
        console.error("Failed to update data.");
    }
} catch (error) {
    console.error("Error updating data:", error);
}
}

// 서버 시작 시 데이터를 처음으로 업데이트하고, 이후 설정한 시간 간격(UPDATE_INTERVAL)으로 업데이트를 반복
updateDataPeriodically();
setInterval(updateDataPeriodically, UPDATE_INTERVAL);

app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});