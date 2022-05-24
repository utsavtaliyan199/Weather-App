const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", Math.floor(orgVal.main.temp-273.15));
    temperature = temperature.replace("{%tempmin%}", Math.floor(orgVal.main.temp_min-273.15));
    temperature = temperature.replace("{%tempmax%}", Math.floor(orgVal.main.temp_max-273.15));
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
    return temperature;
};

const server = http.createServer((req, res) => {
    if (req.url == "/") // it means it's our homepage
    {
        requests('https://api.openweathermap.org/data/2.5/weather?q=Kanpur&appid=1eaf8b128545e37bff11ff25e0e939cd', {

            })
            .on('data', (chunk) => {
                const objData = JSON.parse(chunk);
                const arrData = [objData];
                // console.log(arrData[0].main.temp);

                const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
                 res.write(realTimeData)
               // console.log(realTimeData);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
                // console.log('end');
            });
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
})

server.listen(process.env.PORT||8000);
