const express = require('express');
const app = express();
const __path = process.cwd();
const PORT = process.env.PORT || 8000;
let code = require('./pair'); 

require('events').EventEmitter.defaultMaxListeners = 500;

// ✅ මෙන්න මේ පේළි දෙක routes වලට කලින් උඩින්ම දාන්න 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ඊට පස්සේ routes ටික දාන්න
app.use('/code', code);

app.use('/pair', async (req, res, next) => {
    res.sendFile(__path + '/pair.html')
});

app.use('/settings', async (req, res, next) => {
    res.sendFile(__path + '/settings.html')
});

app.use('/', async (req, res, next) => {
    res.sendFile(__path + '/main.html')
});

app.listen(PORT, () => {
    console.log(`\nDon't Forget To Give Star ‼️\n\n༊·˚ 𝐐υєєη 𝐒єуα 𝐗м∂ 𝐕3 ༊·˚ NEW UPDATE\n\nServer running on http://localhost:` + PORT)
});

module.exports = app;
