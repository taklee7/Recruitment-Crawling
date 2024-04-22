const puppeteer = require('puppeteer');
const express = require('express');
var cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let cachedData = null; // 캐시된 데이터를 저장할 변수

async function scrapeData(url) {
  // Puppeteer 설정 추가
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });

  const data = await page.evaluate(() => {
    const items = [];
    const listItems = document.querySelectorAll('.RecruitList_recruit-list__cjKzb.RecruitList_TABLET__MsUU5');
    listItems.forEach(item => {
      const title = item.querySelector('.RecruitList_title__nyhAL')?.innerText;
      const dday = item.querySelector('.RecruitList_dday__OelP5')?.innerText;
      const url = item.querySelector('a.RecruitList_list-item__RF9iK.RecruitList_TABLET__MsUU5')?.href;
      items.push({ title, dday, url });
    });
    return items;
  });

  await browser.close();
  return data;
}

const url = 'https://flyasiana.recruiter.co.kr/career/recruitment';

app.get('/api/data', async (req, res) => {
  if (cachedData) {
    res.status(200).send(cachedData);
  } else {
    res.status(404).send({ message: "Data not available yet." });
  }
});

scrapeData(url).then(data => {
  cachedData = data;
}).catch(error => {
  console.error("An error occurred: ", error);
});

setInterval(() => {
  scrapeData(url).then(data => {
    cachedData = data;
    console.log(new Date().toISOString(), data);
  }).catch(error => {
  console.error("An error occurred: ", error);
  });
}, 600000*3); // 60000ms = 1분

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
